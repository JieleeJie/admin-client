import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import { createDeleteUserInfoAction } from '../../redux/actions/login';
import { Layout } from 'antd';
import './admin.less'
import Header from './header/header'
import LeftNav from './left_nav/left_nav'
import Home from '../../components/home/home'
import Category from '../category/category'
import Product from '../product/product'
import User from '../user/user'
import Role from '../role/role'
import Bar from '../bar/bar'
import Line from '../line/line'
import Pie from '../pie/pie'
import Detail from '../product/detail'
import AddAndUpdate from '../product/addAndUpdate'


const { Footer, Sider, Content } = Layout;

@connect(
    state => ({ userInfo: state.userInfo }),
    {
        deleteUserInfo: createDeleteUserInfoAction,
    }
)
class Admin extends Component {

    logOut = () => {
        // 清除localStorage和redux中关于登录的信息
        this.props.deleteUserInfo()
        // 清除了redux中关于登录的信息后，state改变了会重新渲染页面，判断为没登录，<Redirect to='login'/>
    }


    render() {
        const { isLogin } = this.props.userInfo
        if (!isLogin) {
            return <Redirect to='/login' />
        }
        return (
            <>
                <Layout className='admin'>
                    <Sider className='sider'>
                        <LeftNav />
                    </Sider>
                    <Layout>
                        <Header>Header</Header>
                        <Content className='content'>
                            <Switch>
                                <Route path='/admin/home' component={Home}/>
                                <Route path='/admin/prod_about/category' component={Category}/>
                                <Route path='/admin/prod_about/product' component={Product} exact/>
                                {/* add_update/:id是详情页。/add_update是添加页，这两者的顺序不能颠倒，不然就永远无法匹配到添加页。另一种方案是给添加页开启严格模式 */}
                                <Route path='/admin/prod_about/product/add_update/:id' component={AddAndUpdate}/>
                                <Route path='/admin/prod_about/product/add_update' component={AddAndUpdate}/>
                                {/* 接收不同的参数类型:params参数(只传递_id) 和 state参数(传递该商品信息) */}
                                <Route path='/admin/prod_about/product/detail/:id' component={Detail}/>
                                {/* <Route path='/admin/prod_about/product/detail' component={Detail}/> */}
                                <Route path='/admin/user' component={User}/>
                                <Route path='/admin/role' component={Role}/>
                                <Route path='/admin/charts/bar' component={Bar}/>
                                <Route path='/admin/charts/pie' component={Pie}/>
                                <Route path='/admin/charts/line' component={Line}/>
                                <Redirect to='/admin/home'/>
                            </Switch>
                        </Content>
                        <Footer className='footer'>
                            建议使用谷歌浏览器，以获得最佳体验
                        </Footer>
                    </Layout>
                </Layout>
            </>

        )
    }
}

export default Admin