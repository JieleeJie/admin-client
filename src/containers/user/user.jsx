import React, { PureComponent } from 'react'
import { Card, Button, Modal, Table, message, Form, Input, Select } from 'antd';
import { UserAddOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs'
import { PAGE_SIZE } from '../../config'
import { reqUserList, reqAddUser, reqUpateUser, reqDeleteUser } from '../../api'

const { Option } = Select;
const { confirm } = Modal;

export default class User extends PureComponent {

    state = {
        visible: false,
        loading: true,
        userList: [],
        roleList: [],
        operateType: 'add',
        _id: {}         // 点击修改时模态框当前用户的_id
    }

    formRef = React.createRef()

    componentDidMount() {
        this.getUserList()
    }

    // 获取用户列表哦
    getUserList = async () => {
        let result = await reqUserList()
        const { status, data, msg } = result
        if (status === 0) {
            this.setState({ userList: data.users.reverse(), roleList: data.roles, loading: false })
        } else {
            message.error(msg, 2)
        }
    }

    // 新增用户模态框
    showAddModal = () => {
        this.setState({
            operateType: 'add',
            visible: true
        })
    };

    // 修改用户模态框
    showUpdateModal = (record) => {
        this.setState({
            operateType: 'update',
            _id: record._id,
            visible: true
        })
        this.formRef.current.setFieldsValue({ ...record })
    }

    // 模态框确认按钮
    handleOk = () => {
        // TODO  如果不给Modal加forceRender属性，就贼tm神奇
        // console.log(this.formRef);              // 这为空
        // console.log(this.formRef.current);      // 这不为空
        this.formRef.current.submit()
    };

    // 模态框取消按钮
    handleCancel = () => {
        this.setState({ visible: false })
        this.formRef.current.resetFields()
    }

    // 新增或修改用户
    onFinish = (values) => {
        const { operateType, _id } = this.state
        if (operateType === 'add') {
            this.addUser(values)
        } else {
            const updateValues = this.formRef.current.getFieldsValue()
            this.updateUser({ ...updateValues, _id })
        }
    }

    // 新增用户的具体实现
    addUser = async (userObj) => {
        let newUserList = [...this.state.userList]
        let result = await reqAddUser(userObj)
        const { status, msg, data } = result
        if (status === 0) {
            message.success('添加用户成功', 2)
            newUserList.unshift(data)
            this.setState({ userList: newUserList, visible: false })
            this.formRef.current.resetFields()
        } else {
            message.error(msg, 2)
        }
    }

    // 更新用户的具体实现
    // TODO 后台不支持更新密码
    updateUser = async (userObj) => {
        let result = await reqUpateUser(userObj)
        const { status, msg, data } = result
        if (status === 0) {
            message.success('用户信息修改成功', 2)
            // 1.不向服务器服务器发请求，更新state 来重新渲染页面
            let newUserList = [...this.state.userList]
            let UpdateIndex = 0
            UpdateIndex = newUserList.findIndex(ele => ele._id === data._id)
            newUserList.splice(UpdateIndex, 1, data)
            this.setState({ userList: newUserList, visible: false })
            this.formRef.current.resetFields()
            // 2. 直接调用getUserList()，代价大
            // this.getUserList()
        } else {
            message.error(msg, 2)
        }
    }

    // 确认删除该用户吗
    deleteConfirm = (userId) => {
        let deleteUser = this.deleteUser
        confirm({
            title: '确认删除该用户吗?',
            icon: <ExclamationCircleOutlined />,
            content: '删除后不可撤回',
            cancelText: '取消',
            okText: '确认',
            onOk() {
                deleteUser(userId)
            },
            onCancel() { },
        });
    }

    // 删除用户的具体实现
    deleteUser = async (userId) => {
        let result = await reqDeleteUser(userId);
        const { status, msg } = result
        if (status === 0) {
            message.success('删除用户成功', 2)
            this.getUserList()
        }
        else {
            message.error(msg, 2)
        }
    }

    render() {
        const { visible, loading, userList, roleList, operateType } = this.state
        const dataSource = userList
        const columns = [
            {
                title: '用户名',
                dataIndex: 'username',
                key: 'username'
            },
            {
                title: '邮箱',
                dataIndex: 'email',
                key: 'email',
            },
            {
                title: '电话',
                dataIndex: 'phone',
                key: 'phone',
            },
            {
                title: '注册时间',
                dataIndex: 'create_time',
                key: 'create_time',
                render: text => dayjs(text).format('YYYY年 MM月DD日 HH:mm:ss')
            },
            {
                title: '所属角色',
                dataIndex: 'role_id',
                key: 'role_id',
                render: (role_id) => {
                    const role = this.state.roleList.find(cur => cur._id === role_id)
                    return role && role.name
                }
            },
            {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                render: (_, record) => {
                    return (
                        <span>
                            <Button type='link' onClick={() => { this.showUpdateModal(record) }}>修改</Button>
                            &nbsp;&nbsp;
                            <Button type='link' onClick={() => { this.deleteConfirm(record._id) }}>删除</Button>
                        </span>
                    )
                }
            },
        ]

        // 表单布局
        const formItemLayout = {
            labelCol: {
                offset: 1,
                span: 4
            },
            wrapperCol: {
                span: 18
            },
        };

        return (
            <>
                <Card title={
                    <Button type='primary' onClick={this.showAddModal}>
                        <UserAddOutlined />新增用户
                    </Button>
                } >
                    <Table dataSource={dataSource} columns={columns} rowKey='_id'
                        bordered pagination={{ pageSize: PAGE_SIZE }} loading={loading}
                    />
                </Card>

                <Modal title={operateType === 'add' ? '新增用户' : '修改用户'} okText='确认' cancelText='取消' forceRender={true}
                    visible={visible} onOk={this.handleOk} onCancel={this.handleCancel}
                >
                    <Form
                        {...formItemLayout}
                        name="userForm"
                        ref={this.formRef}
                        onFinish={this.onFinish}
                        onFinishFailed={() => { message.error('请输入有效表单信息再提交', 2) }}
                        initialValues={{
                            remember: true,
                            prefix: '+86',
                        }}
                        scrollToFirstError
                    >

                        <Form.Item
                            name="username"
                            label="用户名"
                            rules={[
                                { required: true, message: '用户名不能为空!' },
                                { type: 'string', min: 4, message: '用户名不能少于4位!' },
                                { type: 'string', max: 12, message: '用户名不能多于12位!' },
                                { pattern: /^\w+$/, message: '用户名由字母、数字、下划线组成!' },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            label="密码"
                            rules={[
                                { required: true, message: '密码不能为空!' },
                                { type: 'string', min: 4, message: '密码不能少于4位!' },
                                { type: 'string', max: 12, message: '密码不能多于12位!' },
                                { pattern: /^\w+$/, message: '密码由字母、数字、下划线组成!' },
                            ]}
                            hasFeedback
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item
                            name="phone"
                            label="移动电话"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入电话号码!',
                                },
                            ]}
                        >
                            <Input addonBefore='+86' />
                        </Form.Item>

                        <Form.Item
                            name="email"
                            label="邮箱"
                            rules={[
                                { type: 'email', message: '非正确邮箱格式!', },
                                { required: true, message: '请输入邮箱!', },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="role_id"
                            label="角色"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择一个角色!',
                                },
                            ]}
                        >
                            <Select placeholder="选择角色">
                                {
                                    roleList.map(cur => <Option key={cur._id} value={cur._id}>{cur.name}</Option>)
                                }
                            </Select>
                        </Form.Item>

                    </Form>
                </Modal>
            </>
        )
    }
}
