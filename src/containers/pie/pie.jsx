import React, { PureComponent } from 'react'
import ReactECharts from 'echarts-for-react';

export default class Pie extends PureComponent {

    state = {
        data: [
            { value: 40, name: '智能手机' },
            { value: 38, name: 'IT书籍' },
            { value: 32, name: '耳机音响' },
            { value: 30, name: '女士护肤' },
            { value: 28, name: '商务服饰' },
            { value: 26, name: '办公用品' },
            { value: 22, name: '洗护用品' },
            { value: 18, name: '休闲零食' }
        ]
    }

    getOption = (pieChartData) => {
        return {
            title: {
                // text: '商品分类',
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
