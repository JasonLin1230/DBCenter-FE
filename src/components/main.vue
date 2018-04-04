<template>
    <div>
        <el-scrollbar 
            class="menu-wrapper">
            <el-menu
                :default-active="targetTable"
                class="table-menu"
                @select="selectTable">

                <el-menu-item-group>
                    <template slot="title">数据表</template>

                    <div v-if="tableList.length" class="table-list">
                        <el-button type="primary" class="add-table" @click="addTable">添加数据表</el-button>

                        <el-menu-item v-for="table in tableList" :key="table" :index="table">
                            <span>{{ table }}</span> 
                            <i class="el-icon-close" @click.stop="delTable(table)"></i>
                        </el-menu-item>
                    </div>

                    <p v-else class="noTalbe">
                        暂无数据表 <br />
                        点击<el-button type="text" @click="addTable">新建数据表</el-button>
                    </p>
                </el-menu-item-group>

            </el-menu>
        </el-scrollbar>

        <el-scrollbar 
            class="main-wrapper">

            <div class="main">

                <div class="main-header">{{ targetTable || '暂无数据表' }}</div>

                <el-table
                    class="desc-table"
                    :data="tableDesc">
                    <el-table-column
                        type="index">
                    </el-table-column>
                        
                    <el-table-column
                        prop="name"
                        label="名称">
                    </el-table-column>

                    <el-table-column
                        prop="type"
                        label="类型">
                    </el-table-column>

                    <el-table-column
                        prop="notNull"
                        label="是否必填">
                        <template slot-scope="scope">
                            <el-tag
                            :type="scope.row.notNull ? 'success' : 'info'"
                            close-transition>{{ scope.row.notNull ? '是' : '否' }}</el-tag>
                        </template>
                    </el-table-column>

                    <el-table-column
                        prop="unique"
                        label="是否唯一">
                        <template slot-scope="scope">
                            <el-tag
                            :type="scope.row.unique ? 'success' : 'info'"
                            close-transition>{{ scope.row.unique ? '是' : '否' }}</el-tag>
                        </template>
                    </el-table-column>

                    <el-table-column
                        prop="default"
                        label="默认值">
                    </el-table-column>
                </el-table>

            </div>
 
        </el-scrollbar>
        
        <addTable ref="addTable" @reload="reloadTables" />
    </div>
</template>

<script>
import addTable from '@/components/addTable'

export default {
    data() {
        return {
            tableList: [],

            tableDesc: []
        }
    },

    methods: {
        async reloadTables(tableName) {
            const res = await this.$http.get('/table')

            this.tableList = res.data

            this.$router.push({ path: '/', query: { tableName } })
        },

        async loadTables() {
            const res = await this.$http.get('/table')

            this.tableList = res.data

        },

        addTable() {
            this.$refs.addTable.addTableVisible = true
        },

        delTable(table) {
            this.$confirm(`您确认要删除数据表${table}吗？`, '提示').then(async () => {
                
                const res = await this.$http.delete(`table/${table}`)

                if (res.code === 0) {
                    
                    this.$notify({
                        type: 'success',
                        message: '数据表删除成功',
                        duration: 2000
                    })

                    this.reloadTables()
                }

            }).catch(() => {})
        },

        selectTable(index) {
            this.$router.push({ path: '/', query: { tableName: index } })
        }
    },

    components: { addTable },

    watch: {
        targetTable: {
            handler: async function(table) {
                if (table) {

                    const desc = await this.$http.get(`table/desc/${table}`)
                    
                    if (desc.code === 0) {

                        this.tableDesc = desc.data

                    } else {
                        this.$notify({
                            type: 'warning',
                            message: '列表数据请求失败',
                            duration: 2000
                        })
                    }

                } else {
                    this.tableDesc = []
                }
            },
            immediate: true
        }
    },

    computed: {
        targetTable() {
            return this.$route.query.tableName || this.tableList[0]
        }
    },

    created() {
        this.loadTables()
    }
}
</script>

<style scoped>

.menu-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    bottom: -17px;
}

.table-menu {
    width: 200px;
    min-height: 480px;
}

.table-list {
    padding-bottom: 30px;
}

.add-table {
    margin: 7px 20px;
    width: 160px;
}

.noTalbe {
    font-size: 13px;
    text-align: center;
    position: relative;
    top: 180px;
}

.el-icon-close {
    position: absolute;
    right: 19px;
    top: 19px;
    transition: transform .3s;
    display: none;
}
.el-icon-close:hover {
    transform: scale(1.3)
}

.el-menu-item:focus, .el-menu-item:hover {
    background: #fff;
}

.el-menu-item:hover .el-icon-close {
    display: block;
}

.main-wrapper {
    position: absolute;
    right: 0;
    top: 0;
    bottom: -17px;
    left: 220px;
    background: #fff;
}

.main {
    padding: 20px;
}

.main-header {
    border-bottom: 1px dotted #e1e6eb;
    overflow: hidden;
    line-height: 40px;
    padding: 0 14px;
    height: 40px;
    font-size: 14px;
    font-weight: 600;
    color: #333;
}
.desc-table {
    padding-top: 10px;
}
</style>

