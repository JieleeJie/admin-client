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
            title: {
                text: '学科分布',
                left: 'center'
            },
            legend: {
                top: 'bottom'
            },
            tooltip: {},
            dataset: {
                source
            },
            xAxis: { type: 'category' },
            yAxis: {},
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
