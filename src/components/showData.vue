<template>
<div>
    <div class="header">
        <el-button-group class="btn-group">
            <el-button @click="inserData" type="primary" icon="el-icon-edit-outline" size="mini">添加数据</el-button>
        </el-button-group>

        <el-button class="return-btn" @click="returnTalbe" type="text">返回</el-button>
    </div>

    <el-table v-loading="loading" :data="targetTableData" size="mini">

        <el-table-column
            type="index"
            width="55px">
            </el-table-column>

        <el-table-column
            v-for="(item, index) in tableKeys"
            :key="index"
            :property="item"
            :label="item"></el-table-column>

        <el-table-column label="操作" width="150px">
            <template slot-scope="scope">
                <el-button
                    size="mini"
                    @click="updateData(scope.row)">编辑</el-button>
                <el-button
                    size="mini"
                    type="danger"
                    @click="delData(scope.row.id)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>

    <el-pagination
        class="pagination"
        :current-page.sync="currentPage"
        :page-size="10"
        layout="total, prev, pager, next, jumper"
        :total="tableData.length">
    </el-pagination>

    <tableForm ref="form" :targetTable="targetTable" :targetData="targetData" @reload="setTableData" :tableDesc="tableDesc" />
</div>
</template>

<script>
import tableForm from './tableForm'

export default {

    data() {
        return {
            targetData: null,

            loading: false,

            currentPage: 1
        }
    },

    methods: {
        returnTalbe() {
            this.$emit('returnTalbe')
        },

        setTableData() {
            this.loading = true
            this.$store.dispatch('setTableData').then(() => {
                this.loading = false
            })
        },

        inserData() {
            this.targetData = null
            this.$refs.form.visible = true
        },

        updateData(data) {
            this.targetData = data
            this.$refs.form.visible = true
        },

        delData(id) {
            this.$confirm(`您确认要删除这条数据吗？`, '提示').then(async () => {
                const res = await this.$http.delete(`/data/${this.targetTable}`, { data: { id } })
            
                if (res.code === 0) {
                    this.$notify({
                        type: 'success',
                        message: '数据删除成功',
                        duration: 2000
                    })

                    this.setTableData()
                } else {
                    this.$notify({
                        type: 'error',
                        title: '数据删除失败',
                        message: res,message,
                        duration: 2000
                    })
                }
            })
        }
    },

    computed: {
        tableKeys () {
            return this.tableDesc.map((item) => {
                return item.name
            })
        },

        targetTable() {
            return this.$store.state.targetTable
        },

        tableDesc() {
            return this.$store.state.tableDesc
        },

        tableData() {
            return this.$store.state.tableData
        },

        targetTableData() {
            const start = (this.currentPage - 1) * 10
            const end = start + 10
            return this.tableData.slice(start, end)    
        }
    },

    components: { tableForm }
}
</script>

<style scoped>
.header {
    border-bottom: 1px dotted #e1e6eb;
    overflow: hidden;
    padding: 0 14px;
    height: 50px;
}

.btn-group {
    padding-top: 11px;
}

.return-btn {
    font-size: 11px;
    line-height: 24px;
    float: right;
}

.pagination {
    margin: 20px 0;
}
</style>

