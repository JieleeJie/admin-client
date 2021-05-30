import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Card, Button, Input, Select, Table, message } from 'antd'
import { PlusCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { createSaveProductListAction } from '../../redux/actions/product'
import { reqProductList, requpdateStatus, reqSearchProduct } from '../../api'
import { PAGE_SIZE } from '../../config'

const { Option } = Select;

@connect(
    state => ({}),
    {
        saveProdList: createSaveProductListAction
    }
)
class Product extends PureComponent {

    state = {
        productList: [],
        total: '',   // 数据总数
        current: 1,  // 当前所在页
        searchType: 'productName',
        searchKeyword: '',
        isLoading: true
    }

    componentDidMount() {
        this.getProductList()
    }

    // 获取商品列表
    getProductList = async (pageNum = 1) => {
        let result = {}
        if (this.isSearch) {
            const { searchType, searchKeyword } = this.state
            result = await reqSearchProduct(pageNum, PAGE_SIZE, searchType, searchKeyword)
        } else {
            result = await reqProductList(pageNum, PAGE_SIZE)
        }
        this.setState({ isLoading: false })
        const { data, status } = result
        if (status === 0) {
            this.setState({
                productList: data.list,
                total: data.total,
                current: pageNum    //current:data.pageNum 是一样的 data.pageNum就是前台传给服务器的
            })
            this.props.saveProdList(data.list)
        } else {
            message.error('获取商品列表失败', 2)
        }
    }

    // 商品状态处理（上架或者下架）
    updateStatus = async (record) => {
        let { _id, status } = record
        // 修改商品状态  按理说状态改变樱花是后台处理的
        status === 1 ? status = 2 : status = 1
        let result = await requpdateStatus(_id, status)
        if (result.status === 0) {
            // 后台状态修改成功，更改state中的数据，从而修改按钮颜色
            // 可以直接调用getProductList来完成，但数据量大的时候不建议
            let productList = [...this.state.productList]
            productList = productList.map(cur => {
                if (cur._id === _id) {
                    cur.status = status
                }
                return cur
            })
            this.setState({ productList })
        } else {
            message.error('更新状态失败', 1)
        }
    }

    // 商品搜索
    search = async () => {
        //不能将isSearch维护到state中，因为setState是异步的
        this.isSearch = true
        this.getProductList()
    }

    render() {
        const dataSource = this.state.productList
        const columns = [
            {
                title: '商品名称',
                dataIndex: 'name',
                key: 'name',
                width: '18%'
            },
            {
                title: '商品描述',
                dataIndex: 'desc',
                key: 'desc',
            },
            {
                title: '价格',
                dataIndex: 'price',
                key: 'price',
                width: '10%',
                align: 'center',
                render: price => '￥' + price
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                width: '10%',
                align: 'center',
                render: (_, record) => {
                    const { status } = record
                    return (
                        <>
                            <Button
                                type='primary'
                                danger={status === 1 ? true : false}
                                onClick={() => this.updateStatus(record)}
                            >
                                {status === 1 ? '下架' : '上架'}
                            </Button><br />
                            <span>{status === 1 ? '在售' : '已停售'}</span>
                        </>
                    )
                }
            },
            {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                width: '10%',
                align: 'center',
                render: (_, record) => {
                    return (
                        <>
                            {/* 传递不同的参数:params参数(只传递_id) 和 state参数(传递该商品信息) */}
                            <Button type='link' onClick={() => {this.props.history.push(`/admin/prod_about/product/detail/${record._id}`)}}>详情</Button><br />
                            {/* <Button type='link' onClick={() => { this.props.history.push({ pathname: '/admin/prod_about/product/detail', state: record }) }}>详情</Button><br /> */}
                            <Button type='link' onClick={() => { this.props.history.push('/admin/prod_about/product/add_update/1234') }}>修改</Button>
                        </>
                    )
                }
            },
        ];

        const { total, current } = this.state
        return (
            <div>
                <>
                    <Card
                        title={
                            <>
                                <Select defaultValue="productName" onChange={(value) => { this.setState({ searchType: value }) }} >
                                    <Option value="productName">按商品名称搜索</Option>
                                    <Option value="productDesc">按商品描述搜索</Option>
                                </Select>
                                <Input onChange={(e) => { this.setState({ searchKeyword: e.target.value }) }} placeholder="关键字" style={{ width: '25%', margin: '0 10px' }} allowClear />
                                <Button onClick={this.search} type='primary'><SearchOutlined />搜索</Button>
                            </>
                        }
                        extra={<Button type='primary' onClick={() => { this.props.history.push('/admin/prod_about/product/add_update') }}><PlusCircleOutlined />添加商品</Button>}
                    >
                        <Table
                            bordered
                            loading={this.state.isLoading}
                            dataSource={dataSource}
                            columns={columns}
                            rowKey='_id'
                            pagination={{
                                current,
                                pageSize: PAGE_SIZE,
                                total,
                                // 该函数有两个参数，page, pageSize
                                onChange: this.getProductList
                            }}
                        />
                    </Card>
                </>
            </div>
        )
    }
}

export default Product