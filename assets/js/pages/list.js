$(function() {
    var attrList = []

    var dt

    renderTables($('#tables-wrapper').attr('data-target'))

    // 数据表渲染
    function renderTables(targetTable) {
        var $tables = $('#tables')

        // 获取数据表数据
        $.post('/gettables', function(res) {
            var tables = res.data

            if (tables.length) {
                $('#tableInsertBox').show()

                targetTable = targetTable || tables[0]
                
                $tables.html(getTablesTemplate(tables, targetTable))

                $('#table-title').html(targetTable)

                renderTable(tables, targetTable)
                
            } else {
                $('#tableInsertBox').hide()

                var noTablesTemplate = '<div class="no-tables">暂无数据表，点击<a class="table-insert" href="javascript:void(0)">新建数据表</a></div>'

                $tables.html(noTablesTemplate)
            }
        })
    }

    function getTablesTemplate(tables, targetTable) {
        var template = ''
        
        tables.forEach(function(table) {
            template += `<li class="table-item ${table === targetTable ? 'active' : ''}">
                            <a href="?tablename=${table}">
                                <span>${table}</span>
                            </a>

                            <i data-name="${table}" class="table-delete icon-cross3"></i>
                        </li>`
        })

        return template
    }

    // 渲染数据表表格
    function renderTable(tables, targetTable) {
        var ajaxOption = {}

        if (tables.length) {
            ajaxOption = {
                url: '/getTableInfo',
                method: 'POST',
                data: function() {
                    return { target: targetTable }
                }
            }
        } else {
            ajaxOption = null
        }

        // 数据表列表
        $('.table').dataTable({
            ajax: ajaxOption,
            ordering: false,
            dom: '<"datatable-scroll">',
            columnDefs: [
                {
                    targets: [0],
                    searchable: true
                },
                {
                    targets: [1, 2, 3, 4, 5],
                    searchable: false
                },
                {
                    targets: [4, 5],
                    render: function(data){
                        return data
                          ? '<span class="label label-success launch-state">是</span>'
                          : '<span class="label label-default launch-state">否</span>';
                    }
                }
            ],
            initComplete() {
                var db = this
                // 数据表属性搜索
                $('.search-box input').on('input', function() {
                    db.api().search($(this).val()).draw()
                })
            }
        })
    }

    // 插入数据表
    $('#tables-wrapper').on('click', '.table-insert', function() {
        attrList = [
            {
                name: '',
                type: 'string',
                notNull: false,
                unique: false
            }
        ]

        $('#modalTableInsert').modal('show')

        // 新建数据表
        attrList = [
            {
                name: '',
                type: 'string',
                length: 128,
                default: '',
                notNull: false,
                unique: false
            }
        ]

        renderTableInsertAttr()

    })


    // 渲染新建数据表属性
    function renderTableInsertAttr() {
        var html = ''

        attrList.forEach(function(item, i) {
            html += `<form class="attr-item" data-index=${i}>
                        <i class="close-attr icon-cross2 ${attrList.length === 1 ? 'hide' : ''}"></i>   
                        <div class="form-group">
                            <div class="row">
                                <div class="col-sm-6">
                                    <label>属性名称</label>
                                    <input class="attrName form-control" placeholder="避免关键字冲突，请采用 表名_字段名 格式命名" name="name" value="${item.name}">
                                </div>

                                <div class="col-sm-6">
                                    <label>属性类型</label>
                                    <select class="attrType selectbox" data-width="100%">
                                        <option value="string" ${item.type === 'string' ? 'selected' : ''}>字符串</option>
                                        <option value="number" ${item.type === 'number' ? 'selected' : ''}>数字</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <div class="row">
                                <div class="col-sm-6">
                                    <label>字段长度</label>
                                    <input class="attrLength form-control" name="length" value="${item.length}">
                                </div>

                                <div class="col-sm-6">
                                    <label>默认值</label>
                                    <input class="attrDefault form-control" name="default" value="${item.default}">
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <div class="row">
                                <div class="col-sm-6">
                                    <div class="checkbox styled">
                                        <label>
                                            <input type="checkbox" ${item.notNull ? 'checked' : ''} class="attrNotNull styled">
                                            是否必填
                                        </label>
                                    </div>
                                </div>

                                <div class="col-sm-6">
                                    <div class="checkbox styled uniqueBox" style="display: ${item.notNull ? 'block' : 'none'}">
                                        <label>
                                            <input type="checkbox" ${item.unique ? 'checked' : ''} class="unique styled">
                                            是否唯一
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>`
        })
        
        $('#attrs').html(html)

        $('.styled').uniform()

        $("#attrs .selectbox").selectBoxIt({
            autoWidth: false
        })

        $('.attrLength').TouchSpin({
            min: 0,
            max: 1024 * 1024,
        })

        setInsertTableAttrValid()
    }

    // 添加属性
    $('#addAttr').on('click', function() {
        attrList.push({
            name: '',
            type: 'string',
            length: 128,
            default: '',
            notNull: false,
            unique: false
        })

        renderTableInsertAttr()
    })

    // 删除属性
    $('#attrs').on('click', '.close-attr', function() {
        if (attrList.length === 1) return

        var index = $(this).parent().attr('data-index')
        attrList.splice(index, 1)
        renderTableInsertAttr()
    })

    // 新建表格输入框监听
    // 属性名
    $('#attrs').on('change', '.attrName', function() {
        var index = $(this).parent().parent().parent().parent().attr('data-index')
        attrList[index].name = $(this).val()
    })

    // 属性类型
    $('#attrs').on('change', '.attrType', function() {
        var index = $(this).parent().parent().parent().parent().attr('data-index')
        attrList[index].type = $(this).val()
    })

    // 字段长度
    $('#attrs').on('change', '.attrLength', function() {
        var index = $(this).parent().parent().parent().parent().parent().attr('data-index')
        attrList[index].length = $(this).val()
    })

    // 默认值
    $('#attrs').on('change', '.attrDefault', function() {
        var index = $(this).parent().parent().parent().parent().attr('data-index')
        attrList[index].default = $(this).val()
    })

    // 是否必填
    $('#attrs').on('change', '.attrNotNull', function() {
        var $attrItem = $(this).parent().parent().parent().parent().parent().parent().parent().parent()
        var index = $attrItem.attr('data-index')

        var isChecked = $(this).prop('checked')

        attrList[index].notNull = isChecked

        if (!isChecked) {
            $attrItem.find('.uniqueBox').hide()
        } else {
            $attrItem.find('.uniqueBox').show()
        }
    })

    // 是否唯一
    $('#attrs').on('change', '.unique', function() {
        var index = $(this).parent().parent().parent().parent().parent().parent().parent().parent().attr('data-index')
        attrList[index].unique = $(this).prop('checked')
    })


    // 表名 id属性名表单验证规则
    $('#insertTableForm').validate({
        rules: {
            name: {
                required: true,
                dbName: true,
                remote:"/validateTableName"
            }
        },
        messages: {
            name: {
                required: '请输入表名',
                dbName: '字母、下划线开头，由字母、数字、下划线组成',
                remote: '该数据表已存在，请使用其他名称'
            }
        }
    })

    // 新增数据表 属性设置表单验证规则
    function setInsertTableAttrValid() {
        $('.attr-item').each(function(i, item) {
            $(item).validate({
                rules: {
                    name: {
                        required: true,
                        dbName: true
                    }
                },
                messages: {
                    name: {
                        required: '请输入属性名',
                        dbName: '字母、下划线开头，由字母、数字、下划线组成'
                    }
                }
            })
        })
    }

    // 添加数据表提交
    $('#inertTableSubmit').on('click', function(e) {
        e.preventDefault()

        if (!($('#insertTableForm').valid())) return

        var attrItems = $('.attr-item')
        var tableName = $('#inserTableName').val()

        for (let i = 0; i < attrItems.length; i++) {
            if (!($(attrItems[i]).valid())) return
        }

        var btnstate = Ladda.create(this)
		btnstate.start()

        var data = {
            tableName: tableName,
            attrs: attrList
        }

        $.post('/insertTable', data, function(res) {
            btnstate.stop()
            
            if (res.code === 0) {
                new PNotify({
					text: `${tableName}表创建成功！`,
					addclass: 'bg-success'
                })

                setTimeout(function() {
                    location.href = `/?tablename=${tableName}`
                }, 1800)
            } else {
                new PNotify({
                    title: '数据表创建失败！',
                    text: res.msg,
					addclass: 'bg-danger'
				})
            }
        })
    })


    // 数据表删除
    $('#tables-wrapper').on('click',  '.table-delete', function() {
        const tableName = $(this).attr('data-name')

        bootbox.confirm('您确认删除数据表' + tableName + '吗?', function(result) {
            if (!result) return

            $.post('/delTable',  { table: tableName }, function(res) {
                if (res.code === 0) {
                    new PNotify({
                        text: '部门删除成功！',
                        addclass: 'bg-success'
                    })

                    setTimeout(function() {
                        location.href = '/'
                    }, 1800)
                } else {
                    new PNotify({
                        text: '部门删除失败！',
                        addclass: 'bg-danger'
                    })
                }
            })
        })
    })

})