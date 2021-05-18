import axios from 'axios';
import qs from 'querystring'
import { message } from 'antd';
// 进度条效果nprogress
import NProgress from 'nprogress';  
import 'nprogress/nprogress.css'

const instance = axios.create({
    timeout: 3000,
});

// 请求拦截器
instance.interceptors.request.use(function (config) {
    // console.log('**********');
    // console.log(config);
    NProgress.start();
    const { method, data } = config
    if (method.toLowerCase() === 'post') {
        if (data instanceof Object) {
            config.data = qs.stringify(data)
        }
    }
    return config;

}, function (error) {
    // TODO: 什么情况下 请求拦截会失败
    message.error('请求拦截失败' + error.message, 2)
    return Promise.reject(error);
});

// 响应拦截器
instance.interceptors.response.use(function (response) {
    NProgress.done();
    return response.data;
}, function (error) {
    NProgress.done();
    // console.log(error);
    //请求若失败，提示错误（这里可以处理所有请求的异常）
    message.error(error.message,2)
    // 处理完所有错误后，就可以中断Promise链，login.jsx中await就不需要再进行错误处理了
    return new Promise(() => {});
});


export default instance