import { combineReducers } from 'redux';
import loginReducer from './login'
import menuReducer from './menu';

export default combineReducers({
    //该对象里的key和value决定着store里保存该状态的key和value
    userInfo: loginReducer,
    title:menuReducer
})