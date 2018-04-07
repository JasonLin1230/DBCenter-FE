<template>
    <el-dialog
        :title="title"
        :visible.sync="visible"
        :append-to-body="true"
        width="500px">
        
        <el-form
            ref="form"
            size="mini"
            label-position="right"
            label-width="80px"
            :model="formData">

            <el-form-item
                v-for="(item, key) in tableDesc"
                v-if="item.name !== 'id'"
                :key="key"
                :label="item.name">
                {{formData[item.name]}}
                <el-input v-if="item.type === 'String'" v-model="formData[item.name]"></el-input>

                <el-input-number v-else size="mini" :step="1" v-model="formData[item.name]"></el-input-number>
            </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
            <el-button @click="visible = false" size="mini">取 消</el-button>
            <el-button @click="save" type="primary" size="mini">保存</el-button>
        </span>
    </el-dialog>
</template>


<script>
export default {
    data() {
        return {
            visible: false,

            formData: {}
        }
    },

    methods: {
        async save() {
            let result = null

            const id = this.formData.id

            delete this.formData.id

            const attrData = JSON.stringify(this.formData)

            if (id) {
                result = await this.$http.put(`./data/${this.targetTable}`, { id, newAttrData: attrData })
            } else {
                result = await this.$http.post(`./data/${this.targetTable}`, { attrData })
            }

            if (result.code === 0) {

                this.$notify({
                    type: 'success',
                    message: '保存成功',
                    duration: 2000
                })

                this.$emit('reload')

                this.visible = false

            } else {

                this.$notify({
                    type: 'error',
                    title: '保存失败',
                    message: result.message,
                    duration: 2000
                })

            }
        }
    },

    watch: {
        visible(val) {
            if (val) {
                for (let item of this.tableDesc) {
                    this.formData[item.name] = item.default
                }
                
                if (this.targetData) {
                    for (let key in this.targetData) {
                        this.formData[key] = this.targetData[key]
                    }
                }

            } else {
                this.$refs.form.clearValidate()
            }
        }
    },

    props: {
        targetTable: {
            required: true
        },

        targetData: {
            required: true
        },

        tableDesc: {
            type: Array,
            required: true
        }
    },

    computed: {
        title() {
            return this.targetData ? '编辑' : '新建'
        }
    }
}
</script>
