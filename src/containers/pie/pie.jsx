import React, { PureComponent } from 'react'
import ReactECharts from 'echarts-for-react';

export default class Pie extends PureComponent {

    state = {
        data: [
            { value: 40, name: '计算机学院' },
            { value: 38, name: '湘雅公共卫生学院' },
            { value: 32, name: '粉末冶金研究院' },
            { value: 30, name: '交通工程学院' },
            { value: 28, name: '航空航天学院' },
            { value: 26, name: '体育教研部' },
            { value: 22, name: '建筑与艺术学院' },
            { value: 18, name: '材料科学与工程学院' }
        ]
    }

    getOption = (pieChartData) => {
        return {
            title: {
                text: '二级学院',
                textVerticalAlign:'auto',
                top:'center'
            },
            legend: {
                top: 'top'
            },
            toolbox: {
                show: true,
                feature: {
                    mark: { show: true },
                    dataView: { show: true, readOnly: false },
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },
            series: [
                {
                    name: '面积模式',
                    type: 'pie',
                    radius: [50, 250],
                    center: ['50%', '50%'],
                    roseType: 'area',
                    itemStyle: {
                        borderRadius: 8
                    },
                    data: pieChartData
                }
            ]
        };
    }

    render() {
        let pieChartData = [...this.state.data]
        return (
            <>
                <ReactECharts
                    option={this.getOption(pieChartData)}
                    style={{ height: '100%', width: '100%' }}
                />
            </>
        )
    }
}
