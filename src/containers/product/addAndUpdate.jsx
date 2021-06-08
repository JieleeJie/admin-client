import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Card, Form, Input, Select, Button, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import PicturesWall from './picturesWall'
import RichTextEditor from './richTextEditor'
import { reqCategoryList, reqAddProduct,reqDetailProd,reqUpdateProduct } from '../../api'

const { Option } = Select;

@connect(
    state => ({
        categoryList: state.categoryList,
        productList: state.productList
    })
)
class AddAndUpdate extends PureComponent {

    state = {
        categoryList: [],
        operateType: 'add',
        categoryId: '',
        name: '',
        desc: '',
        price: '',
        detail: '',
        imgs: [],
        _id: ''
    }

    // 通过ref得到这个子组件，从而获取相关数据。 或者父先给子传递一个方法，子在特定时刻调用的方式
    picWallRef = React.createRef()
    richTextEditorRef = React.createRef()
    // 获取Form的实例FormInstance,需要调用setFieldsValue来设置Form.Item值
    formRef = React.createRef()

    componentDidMount() {
        const haveId = this.props.match.params.id
        if (haveId) this.upadteProduct(haveId)
        this.saveCateList()
    }

    // 从redux或服务器获取分类列表
    saveCateList = () => {
        const categoryList = this.props
        if (categoryList.length) this.setState({ categoryList })
        else this.getCateListByAjax()
    }

    // 刷新页面redux失效，向服务器发送请求获取分类列表
    getCateListByAjax = async () => {
        let result = await reqCategoryList()
        const { status, msg, data } = result
        if (status === 0) {
            this.setState({ categoryList: data })
        } else {
            message.error(msg, 2)
        }
    }

    // 如果地址栏中含有id，则代表是修改操作
    upadteProduct = (prodId) => {
        this.setState({ operateType: 'update' })
        let result = this.props.productList.find(cur => cur._id === prodId)
        // 如果redux中存在
        if(result){
            // 在页面显示
            this.formRef.current.setFieldsValue({...result})
            this.picWallRef.current.setFileList(result.imgs)
            this.richTextEditorRef.current.HTMLConvertToEditor(result.detail)
            // 维护到state中，方便向后台提交数据
            this.setState({...result})
        }else{
            //刷新后 redux失效，向服务器获取
            this.getProdDetailById(prodId)
        }
    }

    // 刷新页面 redux失效，通过商品id向服务器获取商品详情
    getProdDetailById = async(prodId) => {
        let result = await reqDetailProd(prodId)
        const {status,msg,data} = result
        if(status === 0){
            this.formRef.current.setFieldsValue({...data})
            this.picWallRef.current.setFileList(data.imgs)
            this.richTextEditorRef.current.HTMLConvertToEditor(data.detail)
            // 维护到state中，方便向后台提交数据
            this.setState({...data})
        }else{
            message.error(msg,2)
        }
    }

    // 表单检验通过
    onFinish = async (values) => {
        const imgs = this.picWallRef.current.getImgsName()
        const detail = this.richTextEditorRef.current.editorConvertToHTML()
        const {operateType,_id} = this.state
        let result = {}
        if(operateType === 'add'){
            result = await reqAddProduct({ ...values, imgs, detail })
        }else{
            result = await reqUpdateProduct({_id, ...values, imgs, detail })
        }
        const { status, msg } = result
        if (status === 0) {
            message.success('操作成功', 2)
            this.props.history.replace('/admin/prod_about/product')
        } else message.error(msg, 2)
    };

    // 表单校验 失败
    onFinishFailed = () => {
        message.warning('请输入正确商品信息!', 2)
    };

    render() {
        return (
            <>
                <Card title=
                    {
                        <div className='left-top'>
                            <Button type='link' size='small'>
                                <ArrowLeftOutlined onClick={() => { this.props.history.goBack() }} />
                            </Button>
                            <span>{this.state.operateType === 'add' ? '添加商品' : '修改商品'}</span>
                        </div>
                    }
                >
                    <Form
                        labelCol={{ offset: 1, span: 2 }}
                        wrapperCol={{ span: 8 }}
                        labelAlign="left"
                        name="basic"
                        initialValues={{
                            remember: true,
                        }}
                        ref={this.formRef}
                        onFinish={this.onFinish}
                        onFinishFailed={this.onFinishFailed}
                    >
                        <Form.Item
                            label="商品名称"
                            name="name"
                            rules={[
                                { required: true, message: '请输入商品名称!' },
                            ]}
                            
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="商品描述"
                            name="desc"
                            rules={[
                                { required: true, message: '请输入商品描述!' },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="price"
                            label="商品价格"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入商品价格!',
                                },
                            ]}
                        >
                            <Input
                                // prefix={<MoneyCollectOutlined style={{'fontSize':'16px'}}/>}
                                prefix='￥'
                                addonAfter='元'
                            />
                        </Form.Item>

                        <Form.Item
                            name="categoryId"
                            label="所属分类"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择一个分类',
                                },
                            ]}
                        >
                            <Select placeholder="请选择分类">
                                {
                                    this.state.categoryList.map(cur => {
                                        return <Option key={cur._id} value={cur._id}>{cur.name}</Option>
                                    })
                                }
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="商品图片"
                            name="imgs"
                        >
                            <PicturesWall ref={this.picWallRef} />
                        </Form.Item>

                        <Form.Item
                            label="详情描述"
                            name="detail"
                            wrapperCol={{ span: 12 }}
                        >
                            <RichTextEditor ref={this.richTextEditorRef} />
                        </Form.Item>

                        <Form.Item wrapperCol={{ offset: 1 }}>
                            <Button type="primary" htmlType="submit">
                                {this.state.operateType === 'add' ? '确认添加' : '确认修改'}
                            </Button>
                        </Form.Item>
                    </Form>

                </Card>
            </>
        )
    }
}

export default AddAndUpdate