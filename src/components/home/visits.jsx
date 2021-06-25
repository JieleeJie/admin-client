import React, { PureComponent } from 'react'
import ReactECharts from 'echarts-for-react';


export default class Visits extends PureComponent {

    getPieOption = () => {
        let option = {
            tooltip: {
                trigger: 'item'
            },
            legend: {
                top: '5%',
                left: 'center'
            },
            series: [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: '#fff',
                        borderWidth: 2
                    },
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: '40',
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: [
                        { value: 1048, name: '华为' },
                        { value: 735, name: '小米' },
                        { value: 580, name: 'vivo' },
                        { value: 484, name: 'oppo' },
                        { value: 300, name: '魅族' }
                    ]
                }
            ]
        };
        return option;
    }

    render() {
        return (
            <>
                <ReactECharts
                    option={this.getPieOption()}
                    style={{width:'60%'}}
                />
            </>
        )
    }
}
