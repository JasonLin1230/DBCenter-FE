/* ------------------------------------------------------------------------------
*
*  # Login page
*
*  Specific JS code additions for login and registration pages
*
*  Version: 1.0
*  Latest update: Aug 1, 2015
*
* ---------------------------------------------------------------------------- */

$(function() {

	// uniform控件初始化
	$('.styled').uniform();

	// validate手机验证
	$.validator.addMethod("checkPhone", function(value, element) {  
		var checkPhone = /^[1][3,4,5,7,8][0-9]{9}$/;  
		return this.optional(element) || (checkPhone.test(value)) 
	}, '请输入正确的手机号码！');  

	// 注册账户validate初始化
	$('#registerForm').validate({
		errorClass: 'validation-error-label',
		successClass: 'validation-valid-label',
		highlight: function(element, errorClass) {
			$(element).removeClass(errorClass);
		},
		unhighlight: function(element, errorClass) {
			$(element).removeClass(errorClass);
		},
		rules: {
			phone: {
				required: true,
				checkPhone: true,
				remote:"/login/validatePhone?isRegister=true"
			},
			password: {
				required: true,
				rangelength: [6, 20]
			},
			repeat_password: {
				required: true,
				equalTo:"#registerPassword"
			},
			pin: {
				required: true,
				remote: "/login/validatePin"
			}
		},
		messages: {
			phone: {
				required: '请输入手机号！',
				remote: '该手机已注册！'
			},
			password: {
				required: '请输入密码！',
				rangelength: '长度为6~14个字符！'
			},
			repeat_password: {
				required: '请再次输入密码！',
				equalTo: '两次密码输入不一致！'
			},
			pin: {
				required: '请输入验证码！',
				remote: '验证码不正确！'
			}
		}
	})

	// 注册表单提交
	$('#registerBtn').on('click', function(event) {
		event.preventDefault()

		if (!($('#registerForm').valid())) return
		
		var data = {
			phone: $('#registerPhone').val(),
			password: $('#registerPassword').val()
		}
		
		$.post('/login/register', data, function(res) {
			if (res.code === 0) {
				new PNotify({
					text: '注册成功！',
					addclass: 'bg-success'
				})
				$('#registerForm')[0].reset()
				$('#loginTab').tab('show')
			} else {
				new PNotify({
					text: '服务器错误，请稍后再试！',
					addclass: 'bg-danger'
				})
			}
		})
	})

	// 获取手机验证码
	$('#getPhonePin').on('click', function() {
		var $this = $(this)

		$this.prop('disabled', true)

		// 需要在这里发送手机验证码
		
		var s = 60
		$this.html(s + 's')
		var timer = setInterval(function() {
			if (s >= 0) {
				s --
				$this.html(s + 's')
			} else {
				$this.html('获取验证码')
				clearInterval(timer)
			}
		}, 1000)
	})

	// 登陆validate初始化
	$('#loginForm').validate({
		errorClass: 'validation-error-label',
		successClass: 'validation-valid-label',
		highlight: function(element, errorClass) {
			$(element).removeClass(errorClass);
		},
		unhighlight: function(element, errorClass) {
			$(element).removeClass(errorClass);
		},
		rules: {
			phone: {
				required: true
			},
			password: {
				required: true
			}
		},
		messages: {
			phone: {
				required: '请输入手机号！'
			},
			password: {
				required: '请输入密码！'
			}
		}
	})

	// 登陆表单提交
	$('#loginBtn').on('click', function(event) {
		event.preventDefault()

		if (!($('#loginForm').valid())) return

		var phone = $('#loginPhone').val()
		var password = $('#loginPassword').val()

		$.post('/login', {
			phone: phone,
			password: password
		}, function(res) {
			if (res.code === 0) {
				// 记住密码 设置cookie
				$.cookie("phone", phone)

				if ($('#remember').prop('checked')) {
					$.cookie("password", password)
				} else {
					$.cookie("password", '')
				}

				new PNotify({
					text: '登陆成功！',
					addclass: 'bg-success'
				})
			} else if (res.code === 1) {
				new PNotify({
					text: '用户名或密码错误',
					addclass: 'bg-warning'
				})
			} else {
				new PNotify({
					text: '服务器错误，请稍后再试！',
					addclass: 'bg-danger'
				})
			}
		})
	})

	// 登陆表单设置默认值
	$('#loginPhone').val($.cookie("phone"))
	$('#loginPassword').val($.cookie("password"))

	// 忘记密码激活按钮
	$('#retrieveBtn').on('click', function() {
		$('#retrieve').addClass('active')
	})

	// 忘记密码返回按钮
	$('#backBtn').on('click', function() {
		$('#retrieve').removeClass('active')
	})

	// 获取密码validate初始化
	$('#retrieveForm').validate({
		errorClass: 'validation-error-label',
		successClass: 'validation-valid-label',
		highlight: function(element, errorClass) {
			$(element).removeClass(errorClass);
		},
		unhighlight: function(element, errorClass) {
			$(element).removeClass(errorClass);
		},
		rules: {
			phone: {
				required: true,
				checkPhone: true,
				remote:"/login/validatePhone?isRegister=false"
			}
		},
		messages: {
			phone: {
				required: '请输入手机号！',
				remote: '该手机号尚未注册，请注册！'
			}
		}
	})

	// 找回密码
	$('#getPwdBtn').on('click', function(event) {
		event.preventDefault()

		$('#retrieve').removeClass('active')

		new PNotify({
			text: '密码已发送！',
			addclass: 'bg-success'
		})
	})
})
