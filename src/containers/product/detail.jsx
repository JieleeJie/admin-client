import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { List, Card, Button, message } from 'antd';
import { CaretLeftOutlined } from '@ant-design/icons';
import './detail.less'
import { reqDetailProd, reqCategoryList } from '../../api'
import { BASE_URL } from '../../config'

@connect(
    state => ({
        productList: state.productList,
        categoryList: state.categoryList
    }),
    {}
)
class Detail extends PureComponent {

    state = {
        categoryId: '',
        categoryName: '',
        desc: '',
        detail: '',
        imgs: [],
        name: '',
        price: '',
        isLoading: true
    }

    componentDidMount() {
        this.showDetail()
    }

    // 展示详情
    showDetail = () => {
        // 方法一：接收从product.jsx传递过来的所有参数并展示
        // const detailProd = this.props.location.state
        // if (detailProd) {
        //     // const { categoryId, desc, detail, imgs, name, price } = detailProd
        //     // this.setState({ categoryId, desc, detail, imgs, name, price, isLoading: false })
        //     this.setState({ ...detailProd, isLoading: false })
        // } else {
        //     this.setState({ isLoading: false })
        //     message.error('获取商品详情失败', 2)
        // }

        // 方法二：从product.jsx传递过来_id，通过_id去redux中找对应商品详情
        let detailProdId = this.props.match.params.id
        let reduxProductList = this.props.productList
        if (reduxProductList.length) {
            let detailProd = reduxProductList.find(cur => cur._id === detailProdId)
            if (detailProd) {
                this.categoryId = detailProd.categoryId
                this.setState({ ...detailProd })
            }
        } else {
            this.getDetailProdByID(detailProdId)
        }
        // 商品详情中只有分类id，需要显示分类名,通过分类id从redux或者服务器获取
        let reduxCategoryList = this.props.categoryList
        if (reduxCategoryList.length) {
            let oneCategory = reduxCategoryList.find(cur => cur._id === this.categoryId)
            if (oneCategory) {
                this.setState({ categoryName: oneCategory.name, isLoading: false })
            }
        } else {
            // 不能将this.categoryId作为参数传递，
            // 因为getDetailProdByID发送ajax请求是异步的，此时this.categoryId=undefined
            this.getCategoryNamByID()
        }
    }

    // 刷新后redux失效，通过id从服务器获取详情商品
    getDetailProdByID = async (detailProdId) => {
        let result = await reqDetailProd(detailProdId)
        const { status, data, msg } = result
        if (status === 0) {
            this.categoryId = data.categoryId
            this.setState({ ...data })
        } else {
            message.error(msg, 2)
        }
    }

    // 刷新后redux失效，通过id从服务器获取所属分类的分类名
    getCategoryNamByID = async () => {
        let result = await reqCategoryList()
        const { status, data, msg } = result
        if (status === 0) {
            let oneCategory = data.find(cur => cur._id === this.categoryId)
            if (oneCategory)
                this.setState({ categoryName: oneCategory.name, isLoading: false })
        } else {
            message.error(msg, 2)
        }
    }

    render() {
        return (
            <Card
                title={
                    <div className='left-top'>
                        <Button type='link' size='small'>
                            <CaretLeftOutlined onClick={() => { this.props.history.goBack() }} />
                        </Button>
                        <span>商品详情</span>
                    </div>
                }
                loading={this.state.isLoading}
            >
                <List>
                    <List.Item >
                        <span className="prod-label">商品名称：</span>
                        <span>{this.state.name}</span>
                    </List.Item>
                    <List.Item >
                        <span className="prod-label">商品描述：</span>
                        <span>{this.state.desc}</span>
                    </List.Item>
                    <List.Item >
                        <span className="prod-label">商品价格：</span>
                        <span>{this.state.price}</span>
                    </List.Item>
                    <List.Item >
                        <span className="prod-label">所属分类：</span>
                        <span>{this.state.categoryName}</span>
                    </List.Item>
                    <List.Item >
                        <span className="prod-label">商品图片：</span>
                        {
                            this.state.imgs.map((item, index) => {
                                return <img key={index} src={`${BASE_URL}/api1/upload/` + item} alt="商品图片" className='prod-detail' />
                            })
                        }
                    </List.Item>
                    <List.Item style={{ 'display': 'flex', 'alignItems': 'center' }}>
                        <span className="prod-label">商品详情：</span>
                        <span dangerouslySetInnerHTML={{ __html: this.state.detail }}></span>
                    </List.Item>
                </List>
            </Card>
        )
    }
}
export default Detail