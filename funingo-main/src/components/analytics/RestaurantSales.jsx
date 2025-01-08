import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const dailySalesData = [
    { name: 'Day 1', sales: 4000 },
    { name: 'Day 2', sales: 3000 },
    { name: 'Day 3', sales: 2000 },
    { name: 'Day 4', sales: 2780 },
    { name: 'Day 5', sales: 1890 },
    { name: 'Day 6', sales: 2390 },
    { name: 'Day 7', sales: 3490 },
];

const RestaurantSales = () => {
    const navigate = useNavigate();

    const handleChartClick = () => {
        navigate('/analytics/restaurant-detailed-sales');
    };

    return (
        <div>
            <h2>Restaurant Sales</h2>
            <div onClick={handleChartClick} style={{ cursor: 'pointer' }}>
                    <BarChart width={600} height={400} data={dailySalesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="sales" fill="#8884d8" />
                    </BarChart>
            </div>
        </div>
    );
};

export default RestaurantSales;