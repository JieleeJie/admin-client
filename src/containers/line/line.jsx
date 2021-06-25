import React, { PureComponent } from 'react'
import ReactECharts from 'echarts-for-react';

export default class Line extends PureComponent {

    state = {
        series: [
            {
                name: '魅族',
                type: 'line',
                stack: '总量',
                data: [120, 132, 101, 134, 90, 230, 210]
            },
            {
                name: 'VIVO',
                type: 'line',
                stack: '总量',
                data: [220, 182, 191, 234, 290, 330, 310]
            },
            {
                name: 'OPPO',
                type: 'line',
                stack: '总量',
                data: [150, 232, 201, 154, 190, 330, 410]
            },
            {
                name: '小米',
                type: 'line',
                stack: '总量',
                data: [320, 332, 301, 334, 390, 330, 320]
            },
            {
                name: '华为',
                type: 'line',
                stack: '总量',
                data: [820, 932, 901, 934, 1290, 1330, 1320]
            }
        ]
    }

    getOption = (series) => {
        let option = {
            title: {
                text: ''
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['魅族', 'VIVO', 'OPPO', '小米', '华为']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月']
            },
            yAxis: {
                type: 'value'
            },
            series: series
        };
        return option
    }


    render() {
        const series = [...this.state.series]
        return (
            <>
                <ReactECharts
                    option={this.getOption(series)}
                    style={{ height: '100%', width: '100%' }}
                />
            </>
        )
    }
}
