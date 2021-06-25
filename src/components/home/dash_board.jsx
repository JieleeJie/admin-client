import React, { PureComponent } from 'react'
import ReactECharts from 'echarts-for-react';

export default class DashBoard extends PureComponent {

    componentDidMount() {
        var option = this.getDashBoardOption()
        this.timer = setInterval(() => {
            option.series[0].data[0].value = (Math.random() * 100).toFixed(2) - 0;
            option.series[0].data[1].value = (Math.random() * 100).toFixed(2) - 0;
            option.series[0].data[2].value = (Math.random() * 100).toFixed(2) - 0;
            this.echartRef.getEchartsInstance().setOption(option, true);
        }, 2000);
    }

    componentWillUnmount() {
        clearInterval(this.timer)
    }

    // 仪表盘配置
    getDashBoardOption = () => {
        let option = {
            series: [{
                type: 'gauge',
                anchor: {
                    show: true,
                    showAbove: true,
                    size: 18,
                    itemStyle: {
                        color: '#FAC858'
                    }
                },
                pointer: {
                    icon: 'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
                    width: 8,
                    length: '80%',
                    offsetCenter: [0, '8%']
                },

                progress: {
                    show: true,
                    overlap: true,
                    roundCap: true
                },
                axisLine: {
                    roundCap: true
                },
                data: [{
                    value: 20,
                    name: '女士护肤',
                    title: {
                        offsetCenter: ['-40%', '80%']
                    },
                    detail: {
                        offsetCenter: ['-40%', '95%']
                    }
                },
                {
                    value: 40,
                    name: '手机数码',
                    title: {
                        offsetCenter: ['0%', '80%']
                    },
                    detail: {
                        offsetCenter: ['0%', '95%']
                    }
                },
                {
                    value: 60,
                    name: '休闲零食',
                    title: {
                        offsetCenter: ['40%', '80%']
                    },
                    detail: {
                        offsetCenter: ['40%', '95%']
                    }
                }
                ],
                title: {
                    fontSize: 14
                },
                detail: {
                    width: 40,
                    height: 14,
                    fontSize: 14,
                    color: '#fff',
                    backgroundColor: 'inherit',
                    borderRadius: 3,
                    formatter: '{value}%'
                }
            }]
        };
        return option
    }

    render() {
        return (
            <>
                <ReactECharts
                    ref={(e) => { this.echartRef = e; }}
                    option={this.getDashBoardOption()}
                    style={{ 'height': '110%', 'width': '40%' }}
                />
            </>
        )
    }
}
