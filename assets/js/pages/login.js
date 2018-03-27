$(function() {
	// 登陆validate初始化
	$('#loginForm').validate({
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

		var btnstate = Ladda.create(this)
		btnstate.start()

		var phone = $('#loginPhone').val()
		var password = $('#loginPassword').val()

		var data = {
			phone: phone,
			password: password
		}

		$.post('/login', data, function(res) {
			btnstate.stop()

			if (res.code === 0) {
				// 记住手机号 设置cookie
				if ($('#remember').prop('checked')) {
					$.cookie("phone", phone)
				} else {
					$.cookie("phone", '')
				}                                    
				location.href = '/'
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
	if ($.cookie("phone")) $.uniform.update($('#remember').prop('checked', true))



	// 注册账户validate初始化
	$('#registerForm').validate({
		highlight: function(element, errorClass) {
			$(element).removeClass(errorClass)
			if (element.id === 'registerPhone') $('#sendPhonePin').prop('disabled', true)
		},
		unhighlight: function(element, errorClass) {
			$(element).removeClass(errorClass)
			if (element.id === 'registerPhone') $('#sendPhonePin').prop('disabled', false)			
		},
		rules: {
			phone: {
				required: true,
				phone: true,
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
				remote: {
					url: "/login/validatePin",
					type: "post",
					dataType: "json",  
					data: {
						phone: function() {
							return $("#registerPhone").val();
						}
					}
				}
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
	function register(event) {
		event.preventDefault()

		if (!($('#registerForm').valid())) return
		
		var data = {
			phone: $('#registerPhone').val(),
			password: $('#registerPassword').val()
		}

		var btnstate = Ladda.create($('#registerBtn')[0])

		btnstate.start()
		
		$.post('/login/register', data, function(res) {
			btnstate.stop()

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
	}

	$('#registerBtn').on('click', register)
	$('#registerForm').on('keyup', function(event) {
		if (event.keyCode === 13) register(event)
	})

	// 发送手机验证码
	$('#sendPhonePin').on('click', function() {
		var $this = $(this)

		$this.prop('disabled', true)

		$.post('/login/sendphonePin', {
			phone: $('#registerPhone').val()
		})
		
		var s = 60
		$this.html(s + 's')
		var timer = setInterval(function() {
			if (s > 0) {
				s --
				$this.html(s + 's')
			} else {
				$this.prop('disabled', false)
				$this.html('重新获取验证码')
				clearInterval(timer)
			}
		}, 1000)
	})



	// 忘记密码激活按钮
	$('#getpwdBtn').on('click', function() {
		$('#getpwd').addClass('active')
	})

	// 忘记密码返回按钮
	$('#backBtn').on('click', function() {
		$('#getpwd').removeClass('active')
	})

	// 获取密码validate初始化
	$('#getPwdForm').validate({
		rules: {
			phone: {
				required: true,
				phone: true,
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

	// 找回密码表单提交
	$('#getPwdBtn').on('click', function (event) {
		event.preventDefault()

		if (!($('#getPwdForm').valid())) return

		var data = { phone: $('#getpwdPhone').val() }

		var btnstate = Ladda.create($('#getPwdBtn')[0])

		btnstate.start()

		$.post('/login/sendPwd', data, function(res) {
			btnstate.stop()

			if (res.code === 0) {
				new PNotify({
					text: '密码已发送！',
					addclass: 'bg-success'
				})
		
				$('#getpwd').removeClass('active')
		
				$('#getpwdPhone').val('')
			} else {
				new PNotify({
					text: '服务器请求失败！',
					addclass: 'bg-danger'
				})
			}
		})
	})

})
