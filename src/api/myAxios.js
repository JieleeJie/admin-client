import axios from 'axios';
import qs from 'querystring'
import NProgress from 'nprogress';  // 精度他效果
import 'nprogress/nprogress.css'
import { message } from 'antd';
import store from '../redux/store';
import { createDeleteUserInfoAction } from '../redux/actions/login';

const instance = axios.create({
    timeout: 3000,
});

// 请求拦截器
instance.interceptors.request.use(function (config) {
    NProgress.start();
    // 从redux中获取之前所保存的token, 因为redux存于内存，而localStorage存于硬盘，速度快点
    let token = store.getState().userInfo.token
    //向请求头中添加token，用于校验身份
    if (token) config.headers.Authorization = 'atguigu_' + token
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
    // 若想查看error信息，最好通过debugger。控制台输出的error是通过加工的
    // debugger;
    if (error.response && error.response.status === 401) {
        // token失效或出错
        message.error('身份校验失败，请重新登录', 2)
        //分发一个删除用户信息的action
        store.dispatch(createDeleteUserInfoAction())
    } else {
        //请求若失败，提示错误（这里可以处理所有请求的异常）
        message.error(error.message, 2)
    }
    // 处理完所有错误后，就可以中断Promise链，login.jsx中await就不需要再进行错误处理了
    return new Promise(() => { });
});


export default instance