import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import DetailedDailyRestaurantSales from './DetailedDailyRestaurantSales.jsx';
import { Select, MenuItem, Grid, Typography, Box } from '@mui/material';

const salesBreakdownData = [
    { name: 'Food', value: 4000 },
    { name: 'Beverage', value: 3000 },
    { name: 'Additional Services', value: 2000 },
];

const topItemsData = [
    { name: 'Dish 1', sales: 1500 },
    { name: 'Dish 2', sales: 1200 },
    { name: 'Dish 3', sales: 1100 },
    { name: 'Dish 4', sales: 900 },
    { name: 'Dish 5', sales: 800 },
];

const salesComparisonData = [
    { name: 'Current Week', sales: 15000 },
    { name: 'Previous Week', sales: 14000 },
    { name: 'Current Month', sales: 60000 },
    { name: 'Previous Month', sales: 58000 },
    { name: 'Current Year', sales: 700000 },
    { name: 'Previous Year', sales: 680000 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const DetailedSales = () => {
    const [activeTab, setActiveTab] = useState('daily');
    const [selectedWeek, setSelectedWeek] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');

    const isFilterSelected = () => {
        if (activeTab === 'daily' || activeTab === 'weekend') {
            return selectedWeek && selectedMonth && selectedYear;
        } else if (activeTab === 'weekly') {
            return selectedMonth && selectedYear;
        } else if (activeTab === 'monthly') {
            return selectedYear;
        }
        return false;
    };

    return (
        <div style={{margin:"50px"}} >
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12}>
                    <div>
                        <Typography variant="h6">Filter Sales</Typography>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={activeTab}
                                width={50}
                                onChange={(e) => setActiveTab(e.target.value)}
                            >
                                <MenuItem value="daily">Daily</MenuItem>
                                <MenuItem value="weekly">Weekly</MenuItem>
                                <MenuItem value="monthly">Monthly</MenuItem>
                                <MenuItem value="weekend">Weekend</MenuItem>
                            </Select>
                        </div>
                        <div>
                            {activeTab === 'daily' && (
                                <>
                                    <Select
                                        style={{ margin: "5px" }}
                                        value={selectedWeek}
                                        onChange={(e) => setSelectedWeek(e.target.value)}
                                        displayEmpty
                                    >
                                        <MenuItem value="" disabled>Select Week</MenuItem>
                                        <MenuItem value="week1">Week 1</MenuItem>
                                        <MenuItem value="week2">Week 2</MenuItem>
                                        <MenuItem value="week3">Week 3</MenuItem>
                                        <MenuItem value="week4">Week 4</MenuItem>
                                    </Select>
                                    <Select
                                        style={{ margin: "5px" }}
                                        value={selectedMonth}
                                        onChange={(e) => setSelectedMonth(e.target.value)}
                                        displayEmpty
                                    >
                                        <MenuItem value="" disabled>Select Month</MenuItem>
                                        <MenuItem value="january">January</MenuItem>
                                        <MenuItem value="february">February</MenuItem>
                                        <MenuItem value="march">March</MenuItem>
                                        <MenuItem value="april">April</MenuItem>
                                        <MenuItem value="may">May</MenuItem>
                                        <MenuItem value="june">June</MenuItem>
                                        <MenuItem value="july">July</MenuItem>
                                        <MenuItem value="august">August</MenuItem>
                                        <MenuItem value="september">September</MenuItem>
                                        <MenuItem value="october">October</MenuItem>
                                        <MenuItem value="november">November</MenuItem>
                                        <MenuItem value="december">December</MenuItem>
                                    </Select>
                                    <Select
                                        style={{ margin: "5px" }}
                                        value={selectedYear}
                                        onChange={(e) => setSelectedYear(e.target.value)}
                                        displayEmpty
                                    >
                                        <MenuItem value="" disabled>Select Year</MenuItem>
                                        <MenuItem value="2022">2022</MenuItem>
                                        <MenuItem value="2023">2023</MenuItem>
                                        <MenuItem value="2024">2024</MenuItem>
                                    </Select>
                                </>
                            )}
                            {activeTab === 'weekly' && (
                                <>
                                    <Select
                                        style={{ margin: "5px" }}
                                        value={selectedMonth}
                                        onChange={(e) => setSelectedMonth(e.target.value)}
                                        displayEmpty
                                    >
                                        <MenuItem value="" disabled>Select Month</MenuItem>
                                        <MenuItem value="january">January</MenuItem>
                                        <MenuItem value="february">February</MenuItem>
                                        <MenuItem value="march">March</MenuItem>
                                        <MenuItem value="april">April</MenuItem>
                                        <MenuItem value="may">May</MenuItem>
                                        <MenuItem value="june">June</MenuItem>
                                        <MenuItem value="july">July</MenuItem>
                                        <MenuItem value="august">August</MenuItem>
                                        <MenuItem value="september">September</MenuItem>
                                        <MenuItem value="october">October</MenuItem>
                                        <MenuItem value="november">November</MenuItem>
                                        <MenuItem value="december">December</MenuItem>
                                    </Select>
                                    <Select
                                        style={{ margin: "5px" }}
                                        value={selectedYear}
                                        onChange={(e) => setSelectedYear(e.target.value)}
                                        displayEmpty
                                    >
                                        <MenuItem value="" disabled>Select Year</MenuItem>
                                        <MenuItem value="2022">2022</MenuItem>
                                        <MenuItem value="2023">2023</MenuItem>
                                        <MenuItem value="2024">2024</MenuItem>
                                    </Select>
                                </>
                            )}
                            {activeTab === 'monthly' && (
                                <Select
                                    style={{ margin: "5px" }}
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(e.target.value)}
                                    displayEmpty
                                >
                                    <MenuItem value="" disabled>Select Year</MenuItem>
                                    <MenuItem value="2022">2022</MenuItem>
                                    <MenuItem value="2023">2023</MenuItem>
                                    <MenuItem value="2024">2024</MenuItem>
                                </Select>
                            )}
                            {activeTab === 'weekend' && (
                                <>
                                    <Select
                                        style={{ margin: "5px" }}
                                        value={selectedWeek}
                                        onChange={(e) => setSelectedWeek(e.target.value)}
                                        displayEmpty
                                    >
                                        <MenuItem value="" disabled>Select Week</MenuItem>
                                        <MenuItem value="week1">Week 1</MenuItem>
                                        <MenuItem value="week2">Week 2</MenuItem>
                                        <MenuItem value="week3">Week 3</MenuItem>
                                        <MenuItem value="week4">Week 4</MenuItem>
                                    </Select>
                                    <Select
                                        style={{ margin: "5px" }}
                                        value={selectedMonth}
                                        onChange={(e) => setSelectedMonth(e.target.value)}
                                        displayEmpty
                                    >
                                        <MenuItem value="" disabled>Select Month</MenuItem>
                                        <MenuItem value="january">January</MenuItem>
                                        <MenuItem value="february">February</MenuItem>
                                        <MenuItem value="march">March</MenuItem>
                                        <MenuItem value="april">April</MenuItem>
                                        <MenuItem value="may">May</MenuItem>
                                        <MenuItem value="june">June</MenuItem>
                                        <MenuItem value="july">July</MenuItem>
                                        <MenuItem value="august">August</MenuItem>
                                        <MenuItem value="september">September</MenuItem>
                                        <MenuItem value="october">October</MenuItem>
                                        <MenuItem value="november">November</MenuItem>
                                        <MenuItem value="december">December</MenuItem>
                                    </Select>
                                    <Select
                                        style={{ margin: "5px" }}
                                        value={selectedYear}
                                        onChange={(e) => setSelectedYear(e.target.value)}
                                        displayEmpty
                                    >
                                        <MenuItem value="" disabled>Select Year</MenuItem>
                                        <MenuItem value="2022">2022</MenuItem>
                                        <MenuItem value="2023">2023</MenuItem>
                                        <MenuItem value="2024">2024</MenuItem>
                                    </Select>
                                </>
                            )}
                        </div>
                    </div>
                </Grid>
                <Grid item xs={12} md={6} >
                    <Box sx={{ filter: !isFilterSelected() ? 'blur(5px)' : 'none', pointerEvents: !isFilterSelected() ? 'none' : 'auto' }} >
                        <Typography variant="h6">Daily Sales</Typography>
                        <DetailedDailyRestaurantSales activeTab={activeTab} style={{marginLeft:"40px"}} />
                    </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Box sx={{ filter: !isFilterSelected() ? 'blur(5px)' : 'none', pointerEvents: !isFilterSelected() ? 'none' : 'auto' }}>
                        <Typography variant="h6">Sales Breakdown</Typography>
                        <ResponsiveContainer width="80%" height={400}>
                            <PieChart>
                                <Pie data={salesBreakdownData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                                    {salesBreakdownData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Box sx={{ filter: !isFilterSelected() ? 'blur(5px)' : 'none', pointerEvents: !isFilterSelected() ? 'none' : 'auto' }}>
                        <Typography variant="h6">Top Items Sold</Typography>
                        <ResponsiveContainer width="80%" height={400}>
                            <BarChart data={topItemsData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="sales" fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Box sx={{ filter: !isFilterSelected() ? 'blur(5px)' : 'none', pointerEvents: !isFilterSelected() ? 'none' : 'auto' }}>
                        <Typography variant="h6">Sales Comparison</Typography>
                        <ResponsiveContainer width="80%" height={400}>
                            <BarChart data={salesComparisonData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="sales" fill="#ffc658" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Box>
                </Grid>
            </Grid>
        </div>
    );
};

export default DetailedSales;