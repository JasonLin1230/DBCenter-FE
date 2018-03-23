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
			$(element).removeClass(errorClass);
		},
		unhighlight: function(element, errorClass) {
			$(element).removeClass(errorClass);
		}
    })

    $.validator.addMethod("phone", function(value, element) {  
		var checkPhone = /^[1][3,4,5,7,8][0-9]{9}$/  
		return this.optional(element) || (checkPhone.test(value)) 
    }, '请输入正确的手机号码！')
    
    $.validator.addMethod("word", function(value, element) {  
		var checkWord = /\w+/
		return this.optional(element) || (checkWord.test(value)) 
	}, '请输入正确的手机号码！')

})