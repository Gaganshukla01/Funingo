import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';

const dailySalesData = [
    { name: 'Day 1', sales: 4000 },
    { name: 'Day 2', sales: 3000 },
    { name: 'Day 3', sales: 2000 },
    { name: 'Day 4', sales: 2780 },
    { name: 'Day 5', sales: 1890 },
    { name: 'Day 6', sales: 2390 },
    { name: 'Day 7', sales: 3490 },
];

const weeklySalesData = [
    { name: 'Week 1', sales: 28000 },
    { name: 'Week 2', sales: 30000 },
    { name: 'Week 3', sales: 25000 },
    { name: 'Week 4', sales: 32000 },
];

const monthlySalesData = [
    { name: 'January', sales: 120000 },
    { name: 'February', sales: 110000 },
    { name: 'March', sales: 130000 },
    { name: 'April', sales: 140000 },
];

const weekendSalesData = [
    { name: 'Saturday', sales: 50000 },
    { name: 'Sunday', sales: 60000 },
];

const DetailedSales = ({activeTab}) => {
    const renderChart = () => {
        switch (activeTab) {
            case 'daily':
                return (
                    <ResponsiveContainer width="80%" height={400}>
                        <BarChart data={dailySalesData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="sales" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                );
            case 'weekly':
                return (
                    <ResponsiveContainer width="80%" height={400}>
                        <BarChart data={weeklySalesData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="sales" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                );
            case 'monthly':
                return (
                    <ResponsiveContainer width="80%" height={400}>
                        <BarChart data={monthlySalesData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="sales" fill="#ffc658" />
                        </BarChart>
                    </ResponsiveContainer>
                );
            case 'weekend':
                return (
                    <ResponsiveContainer width="80%" height={400}>
                        <BarChart data={weekendSalesData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="sales" fill="#ff8042" />
                        </BarChart>
                    </ResponsiveContainer>
                );
            default:
                return null;
        }
    };

    return (
        <div>
            {renderChart()}
        </div>
    );
};

export default DetailedSales;