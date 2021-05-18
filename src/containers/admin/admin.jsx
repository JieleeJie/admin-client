import React, { Component } from 'react'
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import {createDeleteUserInfoAction} from '../../redux/actions/login';

class Admin extends Component {

    logOut = () => {
        // 清除localStorage和redux中关于登录的信息
        this.props.deleteUserInfo()
        // 清除了redux中关于登录的信息后，state改变了会重新渲染页面，判断为没登录，<Redirect to='login'/>
    }
    
    render() {
        const {isLogin} = this.props.userInfo
        if(!isLogin){
            return <Redirect to='login'/>
        }
        return (
            <div>
                <h2>欢迎{this.props.userInfo.user.username}</h2>
                <button onClick={this.logOut}>退出登录</button>
            </div>
        )
    }
}

export default connect(
    state => ({userInfo:state.userInfo}),
    {
        deleteUserInfo: createDeleteUserInfoAction,
    }
)(Admin)