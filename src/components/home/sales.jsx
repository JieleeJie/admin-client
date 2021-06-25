import React, { PureComponent } from 'react'
import ReactECharts from 'echarts-for-react';

export default class Sales extends PureComponent {

    // 销售额柱状图配置
    getBarOption = () => {
        let option = {
            title: {
                text: '每日销售额度'
            },
            xAxis: {
                type: 'category',
                data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: [120, 200, 150, 80, 70, 110, 130],
                type: 'bar'
            }]
        };
        return option
    }

    render() {
        return (
            <>
                <ReactECharts
                    option={this.getBarOption()}
                    style={{'width': '70%'}}
                />
            </>
        )
    }
}
