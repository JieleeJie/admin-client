import React, { PureComponent } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Menu } from 'antd';
import { MenuFoldOutlined, PieChartOutlined } from '@ant-design/icons';
import { createSaveTitleAction } from '../../../redux/actions/menu'
import logo2 from '../../../static/images/logo2.png'
import './left_nav.less'
import menuList from '../../../config/menu-config'

const { SubMenu, Item } = Menu;

@connect(
    state => ({}),
    {
        saveTitle: createSaveTitleAction
    }
)
@withRouter
class LeftNav extends PureComponent {

    // componentDidMount(){
    //     console.log(this.props);
    // }

    // 创建左侧菜单栏列表
    createMenuList = (menuList) => {
        return menuList.map((cur) => {
            // TODO:icon无法动态匹配
            // let curIcon = '<PieChartOutlined />'
            if (cur.children instanceof Array) {
                return (
                    <SubMenu key={cur.key} icon={<MenuFoldOutlined />} title={cur.title}>
                        {this.createMenuList(cur.children)}
                    </SubMenu>
                )
            } else {
                return (
                    <Item key={cur.key} icon={<PieChartOutlined />} onClick={() => this.props.saveTitle(cur.title)}>
                        <Link to={cur.path}>{cur.title}</Link>
                    </Item>
                )
            }
        })
    }
    
    render() {
        // 载入页面时默认选中的菜单
        let defaultSelectedKeys = this.props.location.pathname.split('/').reverse()[0]
        // 载入页面时默认打开的多级菜单
        let defaultOpenKeys = this.props.location.pathname.split('/').splice(2)
        return (
            <div >
                <div className='nav-header'>
                    <img src={logo2} alt="logo" />
                    <h1>CSU管理系统</h1>
                </div>
                <Menu
                    defaultSelectedKeys={defaultSelectedKeys}
                    defaultOpenKeys={defaultOpenKeys}
                    mode="inline"
                    theme="dark"
                >
                    {this.createMenuList(menuList)}
                </Menu>
            </div>
        )
    }
}
export default LeftNav