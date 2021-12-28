import axios from 'axios'
import Qs from 'qs' // 用来处理参数

// 添加一个请求拦截器
axios.interceptors.request.use(req => {
        req.headers.languagetype = 'CN'
        req.data = Qs.stringify(req.data)
        req.method = 'POST'
        // TODO 服务器启动时，请求地址
        // req.url = '/sfs' + req.url
        // TODO 本地启动时，请求地址
        req.baseURL = 'http://debian-o:8888/sfs'
        return req
    },
    err => {
        return Promise.reject(err)
    })

//添加一个响应拦截器
axios.interceptors.response.use(res => {
    console.log('响应正常')
    return res.data
}, err => {
    console.log('网络开了小差')
    return Promise.reject(err)
})

export default axios