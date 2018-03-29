import axios from 'axios'

axios.defaults.baseURL = 'http://127.0.0.1'

// 响应拦截器
axios.interceptors.response.use((res) => {

    return res.data

}, (err) => {
    
    window.vm.$notify.error({
        title: '服务器请求失败',
        message: err.message
    })

    throw new Error(err)
})

export default axios