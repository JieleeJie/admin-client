import React, { PureComponent } from 'react'
import { Card, Button, Table, Modal, Form, Input, message, Tree } from 'antd';
import { UsergroupAddOutlined } from '@ant-design/icons';
import dayjs from 'dayjs'
import { connect } from 'react-redux'
import { reqAddRole, reqRoleList, reqAuthRole } from '../../api'
import menuList from '../../config/menu-config'
import {PAGE_SIZE} from '../../config'

@connect(
    state => ({ auth_name: state.userInfo.user.username }),
    {}
)
class Role extends PureComponent {

    state = {
        loading: true,               // 页面是否加载中
        AddRoleVisible: false,      // 控制新增角色模态框是否可见
        authVisible: false,         // 控制给角色授权模态框是否可见
        roleList: [],
        menuList,                   // menu菜单数据，用于渲染 树结构
        checkedKeys: ['home'],
        name:'',                    // 当前行的角色名称
        _id: ''
    };

    // 获取表单节点，点击确认按钮 提交表单 触发OnFinishe
    formRef = React.createRef()

    componentDidMount() {
        this.getRoleList()
    }

    // 向服务器获取并展示角色列表
    getRoleList = async () => {
        const result = await reqRoleList()
        const { status, msg, data } = result
        if (status === 0) {
            this.setState({ roleList: data.reverse(), loading: false })
        } else {
            message.error(msg, 2)
        }
    }

    // 新增角色模态框是否可见
    showAddModal = () => {
        this.setState({ AddRoleVisible: true });
    };

    // 新增角色 模态框确认按钮
    handleAddOk = () => {
        this.formRef.current.submit()
    };

    // 新增角色模态框取消按钮
    handleAddCancel = () => {
        this.setState({ AddRoleVisible: false });
    };

    // 新增角色输入正确
    onFinish = async (values) => {
        const result = await reqAddRole(values.rolename)
        const { status, msg, data } = result
        if (status === 0) {
            message.success('创建角色成功', 2)
            // 1. 不向服务器请求，通过state来重新渲染页面
            let roleList = [...this.state.roleList]
            roleList.unshift(data)
            this.setState({ roleList: roleList,AddRoleVisible: false });
            // 2. 直接向服务器请求
            // this.getRoleList()
            // this.setState({ AddRoleVisible: false });
        } else {
            message.error(msg, 2)
        }
    }

    // 新增角色输入错误
    onFinishFailed = () => {
        message.error('请输入有效信息', 2)
    }

    // 设置权限 模态框是否可见
    showAuthModal = (_id) => {
        const { roleList } = this.state
        let result = roleList.find(cur => cur._id === _id)
        if (result) {
            this.setState({ checkedKeys: result.menus,name:result.name });
        }else{
            message.error('获取当前行数据错误',2)
        }
        this.setState({ _id, authVisible: true, });
    };

    // 设置权限 模态框确认按钮
    handleAuthOk = async () => {
        const { _id, checkedKeys } = this.state
        const { auth_name } = this.props
        let roleObj = {
            _id,
            menus: checkedKeys,
            auth_name,
        }
        let result = await reqAuthRole(roleObj)
        const { status, msg } = result
        if (status === 0) {
            this.setState({ authVisible: false });
            // 因为重新调用getRoleList，所以不需要从result中取出data，data返回的是"当前"角色的所有信息
            this.getRoleList()
        } else {
            message.error(msg, 2)
        }
    };

    // 设置权限 模态框取消按钮
    handleAuthCancel = () => {
        this.setState({ authVisible: false });
    };

    // 点击复选框触发
    onCheck = (checkedKeys) => {
        this.setState({ checkedKeys })
    };


    render() {
        const { AddRoleVisible, roleList, authVisible, menuList, loading,checkedKeys,name } = this.state

        const dataSource = roleList

        const columns = [
            {
                title: '角色名称',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                key: 'create_time',
                render: text => dayjs(text).format('YYYY年 MM月DD日 HH:mm:ss')
            },
            {
                title: '授权时间',
                dataIndex: 'auth_time',
                key: 'auth_time',
                render: (text) => text ? dayjs(text).format('YYYY年 MM月DD日 HH:mm:ss') : ''
            },
            {
                title: '授权人',
                dataIndex: 'auth_name',
                key: 'auth_name',
            },
            {
                title: '操作',
                key: 'option',
                align: 'center',
                render: (record) => <Button type='link' onClick={() => { this.showAuthModal(record._id) }}>设置权限</Button>
            }
        ];

        // 树节点数据
        const treeData = menuList

        return (
            <>
                <Card title={
                    <Button type='primary' onClick={this.showAddModal}>
                        <UsergroupAddOutlined />创建角色
                    </Button>
                }>
                    <Table dataSource={dataSource} columns={columns} rowKey='_id' pagination={{ pageSize:PAGE_SIZE }} loading={loading} />
                </Card>

                {/* 创建角色模态框 */}
                <Modal title="创建角色" destroyOnClose okText='确认' cancelText='取消'
                    visible={AddRoleVisible} onOk={this.handleAddOk} onCancel={this.handleAddCancel}
                >
                    <Form
                        name="basic"
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={this.onFinish}
                        onFinishFailed={this.onFinishFailed}
                        ref={this.formRef}
                    >
                        <Form.Item
                            name="rolename"
                            rules={[
                                { required: true, message: '请输入角色名' },
                            ]}
                        >
                            <Input placeholder='请输入角色名' />
                        </Form.Item>
                    </Form>
                </Modal>

                {/* 设置权限模态框 */}
                <Modal title="设置角色权限" okText='确认' cancelText='取消'
                    visible={authVisible} onOk={this.handleAuthOk} onCancel={this.handleAuthCancel}
                >
                    <span>请为角色 <strong style={{fontSize:18}}>{name}</strong> 设置权限</span>
                    <Tree
                        checkable
                        checkedKeys={checkedKeys}
                        onCheck={this.onCheck}
                        defaultExpandAll
                        treeData={treeData}
                    />
                </Modal>

            </>
        )
    }
}
export default Role