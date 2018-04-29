<template>
    <el-dialog
        title="添加数据表"
        width="850px"
        :visible.sync="addTableVisible">

        <el-form
            ref="form"
            :model="formData"
            :rules="rules"
            label-width="100px"
            size="small">

            <el-form-item label="数据表名" prop="tableName">
                <el-input v-model="formData.tableName" placeholder="字母、下划线开头,字母、数字、下划线组成"></el-input>
            </el-form-item>

            <el-form
                v-for="(attr, index) in attrs"
                ref="attrs"
                :model="attr"
                class="attr"
                :rules="attrRules"
                label-width="100px"
                size="small"
                :key="index">
                
                <div class="item">
                    <el-form-item label="属性名称" prop="name">
                        <el-input v-model="attr.name" placeholder="字母、下划线开头,字母、数字、下划线组成"></el-input>
                    </el-form-item>

                    <el-form-item label="属性类型">
                        <el-select class="attrInt" v-model="attr.type" placeholder="请选择">
                            <el-option value="string" label="字符串"></el-option>
                            <el-option value="number" label="数值"></el-option>                         
                        </el-select>
                    </el-form-item>
                </div>

                <div class="item">
                    <el-form-item label="默认值">
                        
                        <el-input v-if="attr.type === 'string'" v-model="attr.strDefault"></el-input>

                        <el-input-number v-else-if="attr.type === 'number'" v-model="attr.numDefault"></el-input-number>

                    </el-form-item>

                    <div class="group">
                        <el-checkbox v-model="attr.notNull" label="是否必填" name="type"></el-checkbox>
                        <el-checkbox v-model="attr.unique" v-show="attr.notNull" label="是否唯一" name="type"></el-checkbox>

                        <el-button
                            class="attr-btn"
                            type="text"
                            v-show="attrs.length - 1 === index"
                            @click="addAttr">添加属性</el-button>

                        <el-button
                            class="attr-btn"
                            type="text"
                            v-show="attrs.length > 1"
                            @click="removeAttr(index)">删除属性</el-button>
                    </div>
                </div>

            </el-form>

            <el-form-item>
                <el-button @click="onsubmit" :loading="loading" type="primary">立即创建</el-button>
                <el-button @click="addTableVisible = false">取消</el-button>
            </el-form-item>

        </el-form>
    </el-dialog>
</template>

<script>
export default {
    name: 'addTable',

    data() {
        const valiTableName = async (rule, value, callback) => {

            if (value === '') {
                callback(new Error(`数据表名不能为空`));
                return;
            }

            const reg = /^[a-zA-Z_]\w*$/;
            if (!(reg.test(value))) {
                callback(new Error(`数据表名由字母、下划线开头,字母、数字、下划线组成`));
                return;
            }

            const resTable = await this.$http.get(`/table/${value}`);

            if (resTable.code === 0) {
                callback(new Error('该数据表名已存在'));
                return;
            }

            callback();
        };

        const valiAttrname = (rule, value, callback) => {

            if (value === '') {
                callback(new Error(`字段名称不能为空`));
                return;
            }

            const reg = /^[a-zA-Z_]\w*$/;
            if (!(reg.test(value))) {
                callback(new Error(`数据表名由字母、下划线开头,字母、数字、下划线组成`));
                return;
            }

            let count = 0;
            this.attrs.forEach((item) => {
                if (item.name === value) count++;
            })
            if (count > 1) {
                callback(new Error(`字段名称重复`));
                return;
            }

            callback();

        };

        return {
            addTableVisible: false,

            formData: {
                tableName: ''
            },

            attrs: [
                {
                    name: '',
                    type: 'string',
                    strDefault: '',
                    numDefault: '',
                    notNull: false,
                    unique: false
                }
            ],

            rules: {
                tableName: [
                    { validator: valiTableName, trigger: 'change' }
                ]
            },

            attrRules: {
                name: [
                    { validator: valiAttrname, trigger: 'change' }
                ]
            },

            loading: false
        }
    },

    methods: {
        addAttr() {
            this.attrs.push({
                name: '',
                type: 'string',
                strDefault: '',
                numDefault: '',
                notNull: false,
                unique: false
            })
        },

        removeAttr(index) {
            this.attrs.splice(index, 1);
        },

        async onsubmit() {
            if (!(this.validate())) return;

            const result = {};

            result.tableName = this.formData.tableName;

            const attrsRet = [];
            
            this.attrs.forEach((item) => {
                const attr = {};

                attr.name = item.name;

                attr.type = item.type;

                if (item.type === 'string') {
                    attr.default = item.strDefault;
                }
                else if (item.type === 'number') {
                    attr.default = item.numDefault;
                }

                attr.notNull = item.notNull;
                
                attr.unique = item.unique;

                attrsRet.push(attr);
            })

            result.attrs = attrsRet;

            this.loading = true;

            const res = await this.$http.post('table', result);

            this.loading = false;

            if (res.code === 0) {
                this.$notify({
                    type: 'success',
                    message: '数据表创建成功',
                    duration: 2000
                })

                this.addTableVisible = false;

                this.$emit('reload', result.tableName);

                this.formData = { tableName: '' };

                this.attrs = [ { name: '', type: 'string', strDefault: '', numDefault: '', notNull: false, unique: false } ];

                this.$nextTick(() => {
                    this.$refs.form.clearValidate();
                
                    Array.prototype.forEach.call(this.$refs.attrs, (item) => {

                        item.clearValidate();
                    })
                })

            } else {
                this.$notify({
                    type: 'error',
                    title: '数据表创建失败',
                    message: res.message,
                    duration: 2000
                });
            }
            
        },

        validate() {
            let flag = true;

            this.$refs.form.validate((valid) => {
                flag = valid;
            })

            if (!flag) return false;

            return Array.prototype.every.call(this.$refs.attrs, (item) => {
                let res;

                item.validate((valid) => {
                    res = valid;
                })

                return res;
            })
        }
    }
}
</script>

<style scoped>
.item {
    overflow: hidden;
}

.item>* {
    width: 50%;
    float: left;
}

.attr {
    border-top: 1px dashed #ccc;
    padding-top: 28px;
    padding-bottom: 10px;
}

.attrInt {
    width: 100%;
}

.group {
    box-sizing: border-box;
    line-height: 32px;
    padding-left: 33px;
}

.attr-btn {
    float: right;
    padding: 0;
    margin-left: 30px;
    line-height: 32px;
}
</style>
