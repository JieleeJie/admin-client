import React, { Component } from 'react'
import { connect } from 'react-redux';
import { createTest1Action, createTest2Action } from '../../redux/actions/test';
import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './css/login.css'
import logo from './images/logo.png'

class Login extends Component {

    componentDidMount() {
        // 容器组件传来的props
        console.log(this.props);
    }

    onFinish = (values) => {
        console.log('用户名和密码正确', values);
        // 容器组件传来的props
        this.props.test1('***')
    };
    onFinishFailed = ({ values, errorFields, outOfDate }) => {
        alert('请输入正确的用户名和密码再登录!')
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
        return (
            <div className='login'>
                <header>
                    <img src={logo} alt="logo" />
                    <h1 className='h11'>管理系统{this.props.test}</h1>
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

export default connect(
    state => ({ test: state.test }),
    {
        test1: createTest1Action,
        test2: createTest2Action,
    }
)(Login)
