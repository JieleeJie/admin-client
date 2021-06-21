import React, { PureComponent } from 'react'
import ReactECharts from 'echarts-for-react';

export default class Bar extends PureComponent {

    state = {
        source: [
            ['product', '2015', '2016', '2017'],
            ['计算机科学与技术', 43.3, 85.8, 93.7],
            ['软件工程', 83.1, 73.4, 55.1],
            ['电子通信', 86.4, 65.2, 82.5],
            ['人工智能', 72.4, 53.9, 39.1]
        ]
    }

    getOption = (source) => {
        return {
            legend: {},
            tooltip: {},
            dataset: {
                dimensions: ['product', 'CAO', 'appAware', 'mCloud'],
                source: [
                    { product: '25', 'CAO': 0.1, 'appAware': 1, 'mCloud': 2 },
                    { product: '50', 'CAO': 1, 'appAware': 3, 'mCloud': 5 },
                    { product: '75', 'CAO': 1, 'appAware': 4, 'mCloud': 8 },
                    { product: '100', 'CAO': 2, 'appAware': 6, 'mCloud': 10 }
                ]
            },
            xAxis: {
                type: 'category',
                name: '任务数量',
                nameLocation: 'middle',
                nameTextStyle: {
                    fontSize: '16',
                    fontWeight: '500',
                    lineHeight: '20'
                }
            },
            yAxis: {
                name: '平均失败个数',
                nameLocation: 'middle',
                nameTextStyle: {
                    fontSize: '16',
                    fontWeight: '500',
                    lineHeight: '20'
                }
            },
            // Declare several bar series, each will be mapped
            // to a column of dataset.source by default.
            series: [
                { type: 'bar' },
                { type: 'bar' },
                { type: 'bar' }
            ]
        }
    }


    render() {
        let source = [...this.state.source]
        return (
            <>
                <ReactECharts
                    option={this.getOption(source)}
                    style={{ height: '100%', width: '100%' }}
                />
            </>
        )
    }
}
