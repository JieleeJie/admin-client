import React, { PureComponent } from 'react'
import { Button, Modal } from 'antd';
import { FullscreenOutlined, FullscreenExitOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'  // withRouter 非路由组件使用路由组件api
import screenfull from 'screenfull'
import dayjs from 'dayjs'
import { reqWeatherInfo } from '../../../api'
import { createDeleteUserInfoAction } from '../../../redux/actions/login'
import { createDeleteTitleInfoAction } from '../../../redux/actions/menu'
import menuList from '../../../config/menu-config'
import './header.less'

const { confirm } = Modal;

@connect(
    state => ({ userInfo: state.userInfo, title: state.title }),
    {
        deleteUserInfo: createDeleteUserInfoAction,
        deleteTitleInfo: createDeleteTitleInfoAction
    }
)
@withRouter
class Header extends PureComponent {
    state = {
        isFullScreen: false,
        dateAndTime: dayjs().format('YYYY年MM月DD日 HH:mm:ss'),
        weatherInfo: {},
        title: ''
    }

    componentDidMount() {
        // 检测全屏是否变化
        if (screenfull.isEnabled) {
            screenfull.on('change', () => {
                // 在变化之后才获取isFullScreen
                let isFullScreen = !this.state.isFullScreen
                this.setState({ isFullScreen })
            });
        }
        // 更新日期时间
        this.dateAndTimeId = setInterval(() => {
            this.setState({ dateAndTime: dayjs().format('YYYY年MM月DD日 HH:mm:ss') })
        }, 1000);
        // 天气信息
        this.getWeatherInfo()
        //展示当前菜单名称
        this.getTitle()
    }

    componentWillUnmount() {
        clearInterval(this.dateAndTimeId)
    }

    // 全屏开关
    fullScreen = () => {
        if (screenfull.isEnabled) {
            screenfull.toggle();
        }
    }

    // 天气信息
    getWeatherInfo = async () => {
        let weatherInfo = await reqWeatherInfo()
        this.setState({ weatherInfo })
    }

    // 退出登录
    logOut = () => {
        let deleteUserInfo = this.props.deleteUserInfo
        let deleteTitleInfo = this.props.deleteTitleInfo
        confirm({
            title: '确定退出吗?',
            icon: <ExclamationCircleOutlined />,
            content: '退出需要重新登录',
            cancelText: '取消',
            okText: '确定',
            onOk() {
                // 避免this问题，需提前取出
                deleteUserInfo()
                deleteTitleInfo()
            },
            onCancel() { },
        });
    }

    // 获取 当前所处路由页面对应的标题名
    getTitle = () => {
        let title = ''
        let pathname = this.props.location.pathname
        // 如果是product下的路径，如/product/detail/xxID 标题直接显示product对应的标题即可，因为没有设计三级菜单的标题
        // 直接this.setState({ title:"商品管理" })也是可以的，但有点写死的感觉
        if(pathname.indexOf('product') !== -1){
            pathname = '/admin/prod_about/product'
        }
        // 拿到地址栏路径到menuList中匹配对应的title
        menuList.forEach(cur => {
            if (cur.children instanceof Array) {
                // 得到二级菜单中的名称
                // TODO:这儿存在问题，只遍历了两层，没考虑多级菜单
                let temp = cur.children.find(item => pathname === item.path)
                if (temp) title = temp.title
            } else {
                // 得到一级菜单中的名称
                if (pathname === cur.path) title = cur.title
            }
        })
        this.setState({ title })
    }

    render() {
        let { isFullScreen, dateAndTime, weatherInfo } = this.state
        let { username } = this.props.userInfo.user
        return (
            <header className='header'>
                <div className="heander-top">
                    {isFullScreen ? <FullscreenExitOutlined onClick={this.fullScreen} /> : <FullscreenOutlined onClick={this.fullScreen} />}
                    <span>欢迎 {username}</span>
                    <Button type='link' onClick={this.logOut}>退出</Button>
                </div>
                <div className="heander-bottom">
                    <div className='header-bottom-left'>
                        {this.props.title || this.state.title}
                    </div>
                    <div className="header-bottom-right">
                        {dateAndTime}&nbsp;&nbsp;
                        {weatherInfo.city}&nbsp;&nbsp;
                        {weatherInfo.weather}&nbsp;&nbsp;
                        {weatherInfo.temperature}℃
                    </div>
                </div>
            </header>
        )
    }
}

export default Header