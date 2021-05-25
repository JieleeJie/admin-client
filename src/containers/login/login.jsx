import React, { Component } from 'react'
import { connect } from 'react-redux';
import {Redirect} from 'react-router-dom';
import { Form, Input, Button, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { reqLogin } from '../../api';
import { createSaveUserInfoAction } from '../../redux/actions/login';
import './login.less'
import logo from '../../static/images/logo.png'

@connect(
    state => ({isLogin:state.userInfo.isLogin}),
    {
        saveUserInfo: createSaveUserInfoAction,
    }
)
class Login extends Component {

    // componentDidMount() {
    //     // 容器组件传来的props
    //     console.log(this.props);
    // }

    onFinish = async (values) => {
        const { username, password } = values
        let result = await reqLogin(username, password)
        const { status, data, msg } = result
        if (status === 0) {
            // 保存用户信息到redux,并跳转到管理员页面(顺序不能颠倒)
            this.props.saveUserInfo(data)
            this.props.history.replace('/admin')
        } else {
            message.warn(msg, 2)
        }
    };
    onFinishFailed = ({ values, errorFields, outOfDate }) => {
        alert('用户名和密码格式不正确!')
    }

    pwdValidator = (_, value) => {
        if (!value) {
            return Promise.reject(new Error('密码不能为空!'))
        } else if (value.length < 4) {
            return Promise.reject(new Error('密码长度不能少于4位!'))
        } else if (value.length > 12) {
            return Promise.reject(new Error('密码长度不能多于12位!'))
        } else if (!(/^\w+$/).test(value)) {
            return Promise.reject(new Error('由字母、数字、下划线组成!'))
        } else {
            return Promise.resolve();
        }
    }
    render() {
        if(this.props.isLogin){
            return <Redirect to='/admin'/>
        }
        return (
            <div className='login'>
                <header>
                    <img src={logo} alt="logo" />
                    <h1 className='h11'>管理系统</h1>
                </header>
                <section>
                    <h1>用户登录</h1>
                    <Form
                        name="normal_login"
                        className="login-form"
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={this.onFinish}
                        onFinishFailed={this.onFinishFailed}
                    >
                        <Form.Item
                            name="username"
                            rules={[
                                { required: true, message: '用户名不能为空!' },
                                { type: 'string', min: 4, message: '用户名不能少于4位!' },
                                { type: 'string', max: 12, message: '用户名不能多于12位!' },
                                { pattern: /^\w+$/, message: '用户名由字母、数字、下划线组成!' },
                            ]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="请输入用户名" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[{ validator: this.pwdValidator }]}
                        >
                            <Input
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                type="password"
                                placeholder="请输入密码"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Form.Item name="remember" valuePropName="checked" noStyle>
                                <Checkbox>记住密码</Checkbox>
                            </Form.Item>

                            {/* <a className="login-form-forgot" href="javascript:;">
                                忘记密码？
                            </a> */}
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登 录
                            </Button>
                        </Form.Item>
                    </Form>
                </section>
            </div>
        )
    }
}

export default Login
