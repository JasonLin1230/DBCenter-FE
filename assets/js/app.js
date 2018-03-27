$(function() {

    $('.styled').uniform();
    
    $(".selectbox").selectBoxIt()

    bootbox.setDefaults({
        size: 'small',
        title: '提示',
        locale: 'zh_CN'
    })

    PNotify.prototype.options.delay = 1800

    $.validator.setDefaults({
        errorClass: 'validation-error-label',
		successClass: 'validation-valid-label',
		highlight: function(element, errorClass) {
			$(element).removeClass(errorClass)
		},
		unhighlight: function(element, errorClass) {
			$(element).removeClass(errorClass)
		}
    })

    $.validator.addMethod("phone", function(value, element) {  
		var checkPhone = /^[1][3,4,5,7,8][0-9]{9}$/  
		return this.optional(element) || (checkPhone.test(value)) 
    }, '请输入正确的手机号码！')
    
    $.validator.addMethod("dbName", function(value, element) {  
		var checkDbName = /^[a-zA-z_]\w*$/
		return this.optional(element) || (checkDbName.test(value)) 
    }, '请输入正确的手机号码！')


    $.fn.dataTable.ext.errMode = 'none';
    
    $.extend( $.fn.dataTable.defaults, {
        autoWidth: false,
        language: {
            search: '_INPUT_',
            lengthMenu: '<span>显示:</span> _MENU_',
            // 左下角显示信息
            info: '_START_-_END_ of _TOTAL_',
            // 无内容时左下角显示信息
            infoEmpty: '没有数据',
            infoFiltered: '(从 _MAX_ 条数据中检索)',
            // 右下角分页
            paginate: {'first': 'First', 'last': 'Last', 'next': '&rarr;', 'previous': '&larr;'},
            // 搜索无内容时显示
            zeroRecords: '没有符合搜索的数据',
        }
    })
})