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
                dimensions: ['product', 'CAO', 'appAware', 'mCloud','test'],
                source: [
                    { product: '25', 'CAO': 45, 'appAware': 63, 'mCloud': 102 },
                    { product: '50', 'CAO': 87, 'appAware': 129, 'mCloud': 212 },
                    { product: '75', 'CAO': 138, 'appAware': 191, 'mCloud': 305 },
                    { product: '100', 'CAO': 182, 'appAware': 256, 'mCloud': 420 },
                ]
            },
            xAxis: {
                type: 'category',
                name: '任务数量（个）',
                nameLocation: 'middle',
                nameTextStyle: {
                    fontSize: '16',
                    fontWeight: '550',
                    lineHeight: '20'
                }
            },
            yAxis: {
                name: '平均响应时间（秒）',
                nameLocation: 'middle',
                nameTextStyle: {
                    fontSize: '16',
                    fontWeight: '550',
                    lineHeight: '20',
                },
                nameGap:'40'
            },
            // Declare several bar series, each will be mapped
            // to a column of dataset.source by default.
            series: [
                { type: 'line' },
                { type: 'line' },
                { type: 'line' }
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
