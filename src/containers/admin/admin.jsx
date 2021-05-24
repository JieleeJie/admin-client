import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import { createDeleteUserInfoAction } from '../../redux/actions/login';
import { Layout } from 'antd';
import './admin.less'
import Header from './header/header'
import Home from '../../components/home/home'
import Category from '../category/category'
import Product from '../product/product'
import User from '../user/user'
import Role from '../role/role'
import Bar from '../bar/bar'
import Line from '../line/line'
import Pie from '../pie/pie'

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
            return <Redirect to='login' />
        }
        return (
            <>
                <Layout className='admin'>
                    <Sider className='sider'>Sider</Sider>
                    <Layout>
                        <Header>Header</Header>
                        <Content className='content'>
                            <Switch>
                                <Route path='/admin/home' component={Home}/>
                                <Route path='/admin/prod_about/category' component={Category}/>
                                <Route path='/admin/prod_about/product' component={Product}/>
                                <Route path='/admin/user' component={User}/>
                                <Route path='/admin/role' component={Role}/>
                                <Route path='/admin/chart/bar' component={Bar}/>
                                <Route path='/admin/chart/pie' component={Pie}/>
                                <Route path='/admin/chart/line' component={Line}/>
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