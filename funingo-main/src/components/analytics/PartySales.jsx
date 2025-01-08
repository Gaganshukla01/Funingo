import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const PartySales = () => {
    const chartRef = useRef(null);

    useEffect(() => {
        const chartInstance = echarts.init(chartRef.current);
        const option = {
            title: {
                text: 'Party Sales'
            },
            tooltip: {},
            xAxis: {
                type: 'category',
                data: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7']
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: [6000, 5000, 4000, 3780, 2890, 3390, 4490],
                type: 'line'
            }]
        };
        chartInstance.setOption(option);

        return () => {
            chartInstance.dispose();
        };
    }, []);

    return (
        <div>
            <h2>Party Sales</h2>
            <div ref={chartRef} style={{ width: '600px', height: '400px' }}></div>
        </div>
    );
};

export default PartySales;