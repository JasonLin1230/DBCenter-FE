<template>
<div class="page">

    <div class="login-form">

        <p class="title">欢迎来到DBCenter</p>

        <el-form
            @keyup.enter.native="submit"
            :model="form"
            status-icon
            ref="loginForm"
            :rules="rules">

            <el-form-item prop="phone">
                <el-input
                    type="text"
                    v-model="form.phone"
                    prefix-icon="el-icon-mobile-phone"
                    placeholder="请输入手机号"
                    auto-complete="off"></el-input>
            </el-form-item>

            <el-form-item prop="valicode" :error="valicodeErr">

                <el-input
                    type="text"
                    class="valicode-int"
                    v-model="form.valicode"
                    prefix-icon="el-icon-news"
                    placeholder="请输入验证码"
                    auto-complete="off"></el-input>
                
                <el-button @click="sendMsg" :disabled="getMsgDisabled" class="valicode-btn">{{ sendMsgBtnTxt }}</el-button>

            </el-form-item>

            <el-form-item class="submit-box">
                <!-- 登录 -->
                <el-button @click="submit" :loading="submitLoading" type="primary">登录</el-button>
            </el-form-item>

            <p class="desc">DBCenter是专为前端开发者提供的接口调用平台。可以本系统，添加数据表、数据表字段，通过相应的接口，完成对数据库增删改查的操作。点击查看<a href="https://github.com/wrz199306/DECenter-BE" target="_blank">接口文档</a></p>
        </el-form>
    </div>

    <div class="footer">
        <a href="https://github.com/wrz199306" target="_blank">欢迎STAR, 您的支持是我最大的动力! <br /> https://github.com/wrz199306</a>
    </div>
</div>
</template>

<script>
export default {
    data() {
        const validatePhone = (rule, value, callback) => {

            if (value === '') {

                this.getMsgDisabled = true;
                callback(new Error('请输入手机号'));

            } else if (!(/^[1][3,4,5,7,8][0-9]{9}$/.test(value))) {

                this.getMsgDisabled = true;       
                callback(new Error('请输入正确的手机号'));

            } else {

                this.getMsgDisabled = false;           
                callback();

            }
        }

        return {
            form: {
                phone: '',
                valicode: ''
            },

            rules: {
                phone: [ { validator: validatePhone, trigger: 'change' } ],
                valicode: [ { required: true, message: '请输入验证码', trigger: 'change' } ]
            },

            submitLoading: false,

            getMsgDisabled: true,

            sendMsgBtnTxt: '获取验证码',

            valicodeErr: ''
        }
    },

    methods: {
        async sendMsg() {
            this.getMsgDisabled = true;

            let s = 60;

            this.sendMsgBtnTxt = s;

            const timer = setInterval(() => {
                if (s === 0) {
                    clearInterval(timer);
                    this.sendMsgBtnTxt = '发送验证码';
                } else {
                    s--;
                    this.sendMsgBtnTxt = s;
                }
            }, 1000)

            const phone = this.form.phone;

            const result = await this.$http.post('login/sendValiCode', { phone });

            if (result.code === 1) {
                this.$notify.error({
                    title: '验证码发送失败，请稍后重试！'
                })
            }
        },

        submit() {

            this.$refs.loginForm.validate(async (valid) => {
                if (valid) {

                    this.submitLoading = true;
                    
                    const result = await this.$http.post('login', this.form);

                    this.submitLoading = false;

                    if (result.code === 1) {
                        
                        this.valicodeErr = '验证码错误！';
                        return;
                    }

                    this.$store.commit('setUserInfo', result.data);

                    this.$router.push('/');

                }
            })
        }
    }
}
</script>

<style scoped>
.page {
    background: #fff;
    font-family: "PingFangSC-Regular";
    background-image: url('../assets/images/login/bg.png');
    background-size: cover;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
}

.login-form {
    width: 365px;
    height: 390px;
    margin: 100px auto;
    background: #fff;
    padding: 0 37px;
    box-sizing: border-box;
    opacity: 0.95;
    border-radius: 10px;
}
.title {
    text-align: center;
    font-size: 27px;
    color: #333333;
    padding: 27px 0;
}

.valicode-int {
    width: 58%;
}
.valicode-btn {
    width: 40%;
    float: right;
}

.submit-box button {
    width: 100%;
    border-radius: 4px;
    font-size: 15px;
}

.desc {
    color: #666;
    font-size: 14px;
}

.desc a {
    color: #409EFF;
}

.footer {
    position: absolute;
    bottom: 47px;
    width: 100%;
    font-size: 12px;
    opacity: 0.4;
    color: #fff;
    letter-spacing: 1px;
    text-align: center;
}
.footer a {
    color: #fff;
}
.footer a:hover {
    color: #ffd04b;
}
</style>
