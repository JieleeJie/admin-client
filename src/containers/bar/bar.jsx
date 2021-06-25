import React, { PureComponent } from 'react'
import ReactECharts from 'echarts-for-react';

export default class Bar extends PureComponent {

    state = {
        source: [
            ['product', '口红', '眼线', '香水'],
            ['兰蔻', 43.3, 85.8, 93.7],
            ['欧莱雅', 83.1, 73.4, 55.1],
            ['纪梵希', 86.4, 65.2, 82.5],
            ['卡姿兰', 72.4, 53.9, 39.1]
        ]
    }

    getOption = (source) => {
        return {
            title: {
                text: '化妆品品牌',
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
