import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

const data = [
    { name: 'Day 1', sales: 5000 },
    { name: 'Day 2', sales: 4000 },
    { name: 'Day 3', sales: 3000 },
    { name: 'Day 4', sales: 2780 },
    { name: 'Day 5', sales: 1890 },
    { name: 'Day 6', sales: 2390 },
    { name: 'Day 7', sales: 3490 },
];

const TicketCounter = () => {
    return (
        <div>
            <h2>Ticket Counter Sales</h2>
            <BarChart width={600} height={400} data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#82ca9d" />
            </BarChart>
        </div>
    );
};

export default TicketCounter;