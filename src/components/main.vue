<template>
    <div>
        <el-menu
            default-active="2"
            class="table-menu">

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
        
        <addTable ref="addTable" @reload="loadTables" />
    </div>
</template>

<script>
import addTable from '@/components/addTable'

export default {
    data() {
        return {
            tableList: []
        }
    },

    methods: {
        async loadTables() {
            const res = await this.$http.get('/table')

            this.tableList = res.data
        },

        addTable() {
            this.$refs.addTable.addTableVisible = true
        },

        delTable(table) {
            this.$alert(table)
            this.$confirm(`您确认要删除数据表${table}吗？`, '提示').then(async () => {
                
                const res = await this.$http.delete(`table/${table}`)

                if (res.code === 0) {
                    this.$notify({
                        type: 'success',
                        message: '数据表删除成功',
                        duration: 2000
                    })

                    this.loadTables()
                }

            }).catch(() => {})
        }
    },

    components: { addTable },

    created() {
        this.loadTables()
    }
}
</script>

<style scoped>
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
</style>

