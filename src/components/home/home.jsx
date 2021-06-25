import React, { PureComponent } from 'react'
import { Statistic, Card, DatePicker, Timeline } from 'antd';
import { QuestionCircleOutlined, ArrowUpOutlined, ArrowDownOutlined, FieldNumberOutlined,ReloadOutlined } from '@ant-design/icons';
import DashBoard from './dash_board';
import Sales from './sales';
import Visits from './visits';

const { RangePicker } = DatePicker;

export default class Home extends PureComponent {

    state = {
        key: 'sales'
    };

    tabListTitle = [
        {
            key: 'sales',
            tab: '销售额',
        },
        {
            key: 'visits',
            tab: '访问量',
        },
    ];

    // contentListTitle = {
    //     sales: <Sales />,
    //     visits: <Visits />
    // };

    render() {
        return (
            <div style={{ 'height': '100%' }}>
                <div style={{ 'display': 'flex', 'justifyContent': 'space-around', 'height': '50%' }}>
                    <Card title="今日销量" extra={<QuestionCircleOutlined />} hoverable
                        style={{ 'width': '20%', 'height': '65%', 'marginTop': '60px' }}
                        headStyle={{ 'opacity': '0.7' }} >

                        <div style={{ 'padding': '0px' }}>
                            <Statistic
                                value={1128}
                                prefix={<FieldNumberOutlined />}
                            />
                            <Statistic
                                title="周同比"
                                value={11.28}
                                precision={2}
                                valueStyle={{ color: '#3f8600' }}
                                prefix={<ArrowUpOutlined />}
                                suffix="%"
                            />
                            <Statistic
                                title="日同比"
                                value={9.3}
                                precision={2}
                                valueStyle={{ color: '#cf1322' }}
                                prefix={<ArrowDownOutlined />}
                                suffix="%"
                            />
                        </div>
                    </Card>

                    <DashBoard />
                </div>

                <Card
                    style={{ height: '49%', width: '80%', margin: '0 auto' }}
                    tabList={this.tabListTitle}
                    activeTabKey={this.state.key}
                    tabBarExtraContent={<RangePicker />}
                    onTabChange={key => this.setState({ key })}
                >
                    {/* {this.contentListTitle[this.state.key]} */}
                    <div style={{ 'display': 'flex','justifyContent': 'space-around','height':'100%' }}>
                        {this.state.key === 'sales' ? <Sales /> : <Visits />}
                        <Card title="任务" extra={<ReloadOutlined />} hoverabl style={{'width': '30%','height':'90%'}} bodyStyle={{padding:'24px 24px 0'}}>
                            <Timeline>
                                <Timeline.Item color="green">添加医药保健分类</Timeline.Item>
                                <Timeline.Item color="green">添加荣耀50系列手机</Timeline.Item>
                                <Timeline.Item color="red">618活动</Timeline.Item>
                                <Timeline.Item>修改张三的权限</Timeline.Item>
                            </Timeline>
                        </Card>
                    </div>
                </Card>
            </div>

        )
        // return (
        //     <div style={{'display':'flex','alignItems':'center','justifyContent':'center','height':'100%','fontSize':'40px'}}>
        //         中 南 大 学 欢 迎 您
        //     </div>
        // )
    }
}
