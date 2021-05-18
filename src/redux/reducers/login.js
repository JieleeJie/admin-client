import { SAVE_USER_INFO, DELETE_USER_INFO } from '../constant';

let user = JSON.parse(localStorage.getItem('user'))
let token = localStorage.getItem('token')

let initState = {
    user: user || {},
    token: token || '',
    isLogin: user && token ? true : false
}
export default function test(preState = initState, action) {
    const { type, data } = action
    // 不能在此处对data进行解构，因为初始化时data为undefined
    let newState
    switch (type) {
        case SAVE_USER_INFO:
            const { user, token } = data
            newState = { user, token, isLogin: true }
            return newState
        case DELETE_USER_INFO:
            newState = { user: {}, token: '', isLogin: false }
            return newState
        default:
            return preState;
    }
}