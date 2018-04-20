import axios from 'axios';

axios.defaults.baseURL = 'http://127.0.0.1:8888';

// 请求拦截器
axios.interceptors.request.use((req) => {
    
    const { phone, secret} = window.vm.$store.state.userInfo;
    req.headers.phone = phone;
    req.headers.secret = secret;

    return req;

}, (err) => {
    return Promise.reject(err);
});

// 响应拦截器
axios.interceptors.response.use((res) => {

    if (res.data.code === 3012) {
        window.vm.$notify({
            type: 'warning',
            message: '用户信息异常，请重新登陆',
            duration: 2000
        });
        window.vm.$store.commit('setUserInfo', {});

        setTimeout(() => {
            window.location.href = '/#/login';
        }, 2000)
    }

    return res.data;

}, (err) => {
    
    window.vm.$notify.error({
        title: '服务器请求失败',
        message: err.message
    })

    throw new Error(err);
})

export default axios