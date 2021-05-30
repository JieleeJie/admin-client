import React, { PureComponent } from 'react'
import {connect} from 'react-redux'
import { Card, Button, Table, Modal, Form, Input, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {createSaveCategoryListAction} from '../../redux/actions/category'
import { reqCategoryList, reqAddCategory, reqUpdateCategory } from '../../api'
import { PAGE_SIZE } from '../../config/'

@connect(
    state => ({}),
    {
        saveCategoryList : createSaveCategoryListAction
    }
)
 class Category extends PureComponent {

    state = {
        categoryList: [],       //商品分类列表
        visible: false,         //控制弹窗的展示或隐藏
        operationType: '',      //操作类型（新增？修改？）
        isLoading: true,         //控制表格是否处于加载中
        modalCurrentValue: {}    //模态框当前显示值（对象）
    }

    // 创建表单form的ref容器
    formRef = React.createRef();

    componentDidMount() {
        this.getCategoryList()
    }

    // 获取分类列表
    getCategoryList = async () => {
        let categoryList = await reqCategoryList()
        this.setState({ isLoading: false })
        const { status, data, msg } = categoryList
        if (status === 0) {
            this.setState({ categoryList: data.reverse() })
            // 将分类列表存入redux，方便详情页获取分类名称
            this.props.saveCategoryList(data)
        } else {
            message.error(msg, 2)
        }
    }

    // 展示新增分类模态框
    showAddModal = () => {
        this.setState({
            // 清空模态框当前值
            modalCurrentValue: {},
            operationType: 'add',
            visible: true,
        });
    };
    // 展示修改分类模态框
    showUpdateModal = (record) => {
        this.setState({
            modalCurrentValue: record,
            operationType: 'update',
            visible: true,
        });
    };
    //点击模态框ok按钮的回调
    handleOk = () => {
        // 触发表单提交
        this.formRef.current.submit();
    };
    //点击模态框cancle按钮的回调
    handleCancel = () => {
        this.setState({ visible: false });
        // 重置表单域
        this.formRef.current.resetFields();

    };
    // 提交表单且数据验证成功后回调事件
    onFinish = (values) => {
        const { operationType } = this.state
        if (operationType === 'add') this.addCategory(values.categoryName)
        if (operationType === 'update') {
            // 获取新的分类名，包装新对象
            let newCategoryName = values.categoryName
            let categoryId = this.state.modalCurrentValue._id
            let categoryObj = { categoryId: categoryId, categoryName: newCategoryName }
            this.updateCategory(categoryObj)
        }
    };
    // 提交表单且数据验证失败后回调事件
    onFinishFailed = (errorInfo) => {
        message.warning('请输入正确的商品分类名', 2)
        // 不需重置表单域，保留输入框数据
        return
    };
    // 新增分类的具体实现
    addCategory = async (categoryName) => {
        let result = await reqAddCategory(categoryName)
        const { status, data, msg } = result
        if (status === 0) {
            message.success('添加成功', 2)
            this.setState({ categoryList: [data, ...this.state.categoryList], visible: false })
            this.formRef.current.resetFields();
        }
        if (status === 1) {
            message.error(msg, 2)
        }
    }
    // 修改分类的具体实现
    updateCategory = async (categoryObj) => {
        let result = await reqUpdateCategory(categoryObj)
        const { status, msg } = result
        if (status === 0) {
            message.success('成功', 2)
            this.getCategoryList()
            this.setState({ visible: false });
            this.formRef.current.resetFields();
        } else {
            message.error(msg, 2)
        }
    }

    render() {
        const dataSource = this.state.categoryList
        let { operationType, visible } = this.state
        const columns = [
            {
                title: '类别',
                dataIndex: 'name',
                key: 'categoryName',
            },
            {
                title: '操作',
                // dataIndex: 'operation',
                key: 'operation',
                width: '25%',
                align: 'center',
                render: (record) => { // record 表示当前行的值，可查表格->列的api
                    return <Button type='link' onClick={() => { this.showUpdateModal(record) }}>修改分类</Button>
                }
            },
        ];
        return (
            <>
                <Card extra={<Button type='primary' onClick={this.showAddModal}><PlusOutlined />添加</Button>} >
                    <Table dataSource={dataSource} columns={columns} rowKey='_id' pagination={{ pageSize: PAGE_SIZE, showQuickJumper: true }} bordered loading={this.state.isLoading} />
                </Card>
                <Modal
                    title={operationType === 'add' ? '添加分类' : '修改分类'}
                    visible={visible} destroyOnClose
                    cancelText='取消' onOk={this.handleOk}
                    okText='确认' onCancel={this.handleCancel}>
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
                            name="categoryName"
                            rules={[{ required: true, message: '商品分类名不能为空!' }]}
                            initialValue={this.state.modalCurrentValue.name}
                        >
                            <Input placeholder='请输入商品分类名' />
                        </Form.Item>
                    </Form>
                </Modal>
            </>
        )
    }
}
export default Category