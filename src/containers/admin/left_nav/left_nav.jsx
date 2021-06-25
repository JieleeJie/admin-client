import React, { PureComponent } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Menu } from 'antd';
import  * as Icon from '@ant-design/icons';
import { createSaveTitleAction } from '../../../redux/actions/menu'
import logo2 from '../../../static/images/logo2.png'
import './left_nav.less'
import menuList from '../../../config/menu-config'

const { SubMenu, Item } = Menu;

@connect(
    state => ({
        username: state.userInfo.user.username,
        role: state.userInfo.user.role,
    }),
    {
        saveTitle: createSaveTitleAction
    }
)
@withRouter
class LeftNav extends PureComponent {

    // 根据用户所属角色是否有相应权限来创建左侧菜单栏
    hasAuth = (menuItem) => {
        // 连续解构
        const { username, role: { menus } } = this.props
        // 如果是admin 或者 是一级菜单，且该菜单的key被包含在menus中 则创建
        if (username === 'admin' || menus.includes(menuItem.key)) {
            return true
            // 如果是二级菜单，且该菜单的key被包含在menus中 则创建
        } else if (menuItem.children) {
            return menuItem.children.some(menuItemChild => menus.includes(menuItemChild.key))
        }
        return false
    }

    // 创建左侧菜单栏列表 
    createMenuList =(menuList) => {
        return menuList.reduce((pre,cur) => {
            // 根据用户所属角色是否有当前菜单的权限再创建
            if (this.hasAuth(cur)) {
                if (cur.children instanceof Array) {
                    pre.push (
                        <SubMenu key={cur.key} icon={React.createElement(Icon[cur.icon])} title={cur.title}>
                            {this.createMenuList(cur.children)}
                        </SubMenu>
                    )
                }else {
                    pre.push (
                        <Item key={cur.key} icon={React.createElement(Icon[cur.icon])} onClick={() => this.props.saveTitle(cur.title)}>
                            <Link to={cur.path}>{cur.title}</Link>
                        </Item>
                    )
                }
            }
            return pre
        },[])
    }

    // 创建左侧菜单栏列表 
    // map 方法存在 if外层无返回值的问题
    /*createMenuListByMap = (menuList) => {
        return menuList.map((cur) => {
            if (this.hasAuth(cur)) {
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
            }
            return null
        })
    }*/

    render() {
        let pathname = this.props.location.pathname
        // 载入页面时默认选中的菜单      
        // 如果地址栏路径中含有product则一直选中product(商品管理)，解决了查看详情、添加商品时left_nav没有选中效果。这并不是完美的解决方案，若含有production就会出错
        let selectedKeys = pathname.indexOf('product') !== -1 ? 'product' : pathname.split('/').reverse()[0]
        // 载入页面时默认打开的多级菜单
        let defaultOpenKeys = pathname.split('/').splice(2)
        return (
            <div >
                <div className='nav-header'>
                    <img src={logo2} alt="logo" />
                    <h1>后台管理系统</h1>
                </div>
                <Menu
                    selectedKeys={selectedKeys}
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