import React, { PureComponent } from 'react'
import { Button, Modal } from 'antd';
import { FullscreenOutlined, FullscreenExitOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'  // withRouter 非路由组件使用路由组件api
import screenfull from 'screenfull'
import dayjs from 'dayjs'
import { reqWeatherInfo } from '../../../api'
import { createDeleteUserInfoAction } from '../../../redux/actions/login'
import menuList from '../../../config/menu-config'
import './header.less'

const { confirm } = Modal;

@connect(
    state => ({ userInfo: state.userInfo, title: state.title }),
    { deleteUserInfo: createDeleteUserInfoAction }
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
        confirm({
            title: '确定退出吗?',
            icon: <ExclamationCircleOutlined />,
            content: '退出需要重新登录',
            cancelText: '取消',
            okText: '确定',
            onOk() {
                // 避免this问题，需提前取出
                deleteUserInfo()
            },
            onCancel() { },
        });
    }

    // 获取 当前所处路由页面 名称
    getTitle = () => {
        let path = this.props.location.pathname
        let pathTitle = ''
        menuList.forEach(cur => {
            if (cur.children instanceof Array) {
                // TODO:这儿也存在问题，只遍历了两层，若是多级菜单呢？
                // 得到二级菜单中的名称
                let temp = cur.children.find(item => path === item.path)
                if (temp) pathTitle = temp.title
            } else {
                if (path === cur.path) pathTitle = cur.title
            }
        })
        this.setState({ title: pathTitle })
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