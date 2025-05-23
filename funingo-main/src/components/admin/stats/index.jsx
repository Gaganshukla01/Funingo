import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { apiUrl } from '../../../constants';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar,IndianRupee, TrendingUp, PieChart as PieChartIcon, BarChart3, Activity, Users, UserCheck, Package } from 'lucide-react';



const mockSalesData = [
  { _id: '1', date: '2024-12-02T00:00:00.000Z', amount: 2200, section: 'Ticket Counter', split: 'Activities' },
  { _id: '2', date: '2024-12-03T00:00:00.000Z', amount: 1700, section: 'Party Sales', split: 'Food' },
  { _id: '3', date: '2024-12-03T00:00:00.000Z', amount: 2100, section: 'Restaurant', split: 'Activities' },
  { _id: '4', date: '2024-12-04T00:00:00.000Z', amount: 2500, section: 'Ticket Counter', split: 'Food' },
  { _id: '5', date: '2024-12-05T00:00:00.000Z', amount: 1800, section: 'Restaurant', split: 'Food' },
  { _id: '6', date: '2024-12-06T00:00:00.000Z', amount: 3200, section: 'Party Sales', split: 'Activities' },
  { _id: '7', date: '2024-12-07T00:00:00.000Z', amount: 2800, section: 'Restaurant', split: 'Food' },
  { _id: '8', date: '2024-12-08T00:00:00.000Z', amount: 1900, section: 'Ticket Counter', split: 'Activities' },
  { _id: '9', date: '2024-12-09T00:00:00.000Z', amount: 2600, section: 'Party Sales', split: 'Food' },
  { _id: '10', date: '2024-12-10T00:00:00.000Z', amount: 3400, section: 'Restaurant', split: 'Activities' },
];

const mockActivitiesData = [
  { _id: '1', name: 'Yoga Class', redemptions: 25, assignedPeople: ['John Doe', 'Jane Smith', 'Mike Johnson'], date: '2025/05/19' },
  { _id: '2', name: 'Swimming Pool', redemptions: 40, assignedPeople: ['Sarah Wilson', 'Tom Brown'], date: '2025/05/19' },
  { _id: '3', name: 'Gym Access', redemptions: 60, assignedPeople: ['Chris Lee', 'Emma Davis', 'Alex Chen', 'Lisa Wang'], date: '2025/05/19' },
  { _id: '4', name: 'Tennis Court', redemptions: 15, assignedPeople: ['David Miller'], date: '2025/05/19' },
  { _id: '5', name: 'Spa Treatment', redemptions: 30, assignedPeople: ['Rachel Green', 'Monica Geller'], date: '2025/05/19' },
];

const mockCustomerInsights = {
  popularPackages: [
    { name: 'Family Fun Package', sales: 145 },
    { name: 'Premium Sports Package', sales: 98 },
    { name: 'Weekend Warrior', sales: 87 },
    { name: 'Couples Retreat', sales: 76 },
    { name: 'Kids Birthday Special', sales: 65 },
    { name: 'Corporate Team Building', sales: 54 }
  ],
  ageGroups: [
    { ageRange: '18-25', count: 320 },
    { ageRange: '26-35', count: 580 },
    { ageRange: '36-45', count: 420 },
    { ageRange: '46-55', count: 280 },
    { ageRange: '56-65', count: 150 },
    { ageRange: '65+', count: 80 }
  ],
  repeatRate: 0.68,
  avgOrderValue: 2250
};

// Color schemes
const COLORS = {
  primary: '#3B82F6',
  secondary: '#10B981',
  accent: '#F59E0B',
  danger: '#EF4444',
  purple: '#8B5CF6',
  pink: '#EC4899',
  indigo: '#6366F1',
  teal: '#14B8A6'
};

const PIE_COLORS = [COLORS.primary, COLORS.secondary, COLORS.accent, COLORS.danger, COLORS.purple, COLORS.pink];

// Utility functions
const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', { 
    style: 'currency', 
    currency: 'INR' 
  }).format(amount);
};

// Components
const StatCard = ({ title, value, icon: Icon, color = COLORS.primary, trend }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 border-l-4" style={{ borderLeftColor: color }}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        <p className="text-2xl font-bold" style={{ color }}>{value}</p>
        {trend && (
          <p className="text-sm text-green-600 flex items-center mt-1">
            <TrendingUp className="w-4 h-4 mr-1" />
            {trend}
          </p>
        )}
      </div>
      <div className="p-3 rounded-full" style={{ backgroundColor: `${color}20` }}>
        <Icon className="w-6 h-6" style={{ color }} />
      </div>
    </div>
  </div>
);

const FilterTabs = ({ tabs, activeTab, onTabChange }) => (
  <div className="flex flex-wrap gap-2 mb-6">
    {tabs.map((tab) => (
      <button
        key={tab}
        onClick={() => onTabChange(tab)}
        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
          activeTab === tab
            ? 'bg-blue-600 text-white shadow-md'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        {tab}
      </button>
    ))}
  </div>
);

const ChartCard = ({ title, children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
    <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
    {children}
  </div>
);

// Main Dashboard Component
const Stats = () => {
  const [salesData, setSalesData] = useState(mockSalesData);
  const [activitiesData, setActivitiesData] = useState(mockActivitiesData);
  const [customerInsights, setCustomerInsights] = useState(mockCustomerInsights);
  const [activeSection, setActiveSection] = useState('All');
  const [activeSplit, setActiveSplit] = useState('All');
  const [dateRange, setDateRange] = useState('7d');

 
    // const fetchData = async () => {
    //   try {
    //     const salesResponse = await axios.get(`${apiUrl}/insights/salesfetch`);
    //     const sales = salesResponse.data; 
    //     setSalesData(sales);

    //     const activitiesResponse = await axios.get(`${apiUrl}/insights/activityfetch`);
    //     const activities = activitiesResponse.data;
    //     setActivitiesData(activities);

    //     console.log(activities)
    //     const insightsResponse = await axios.get(`${apiUrl}/insights/customerinsightfetch`);
    //     const insights = insightsResponse.data;
    //     setCustomerInsights(insights);
        
    //   } catch (error) {
    //     console.error('Error fetching data:', error);
    //   }
    // };

    // fetchData();
  


  // Filter data based on selections
  const filteredSalesData = salesData.filter(item => {
    const sectionMatch = activeSection === 'All' || item.section === activeSection;
    const splitMatch = activeSplit === 'All' || item.split === activeSplit;
    return sectionMatch && splitMatch;
  });

  // Calculate metrics
  const totalRevenue = filteredSalesData.reduce((sum, item) => sum + item.amount, 0);
  const averageOrderValue = totalRevenue / filteredSalesData.length || 0;
  const totalOrders = filteredSalesData.length;

  // Prepare chart data
  const dailySalesData = filteredSalesData.reduce((acc, item) => {
    const date = formatDate(item.date);
    const existing = acc.find(d => d.date === date);
    if (existing) {
      existing.amount += item.amount;
      existing.orders += 1;
    } else {
      acc.push({ date, amount: item.amount, orders: 1 });
    }
    return acc;
  }, []).sort((a, b) => new Date(a.date) - new Date(b.date));

  // Section-wise revenue
  const sectionData = filteredSalesData.reduce((acc, item) => {
    const existing = acc.find(d => d.name === item.section);
    if (existing) {
      existing.value += item.amount;
    } else {
      acc.push({ name: item.section, value: item.amount });
    }
    return acc;
  }, []);

  // Split-wise revenue
  const splitData = filteredSalesData.reduce((acc, item) => {
    const existing = acc.find(d => d.name === item.split);
    if (existing) {
      existing.value += item.amount;
    } else {
      acc.push({ name: item.split, value: item.amount });
    }
    return acc;
  }, []);

  // Top activities by redemptions
  const topActivities = [...activitiesData]
    .sort((a, b) => b.redemptions - a.redemptions)
    .slice(0, 5)
    .map(activity => ({
      name: activity.name,
      redemptions: activity.redemptions,
      staff: activity.assignedPeople.length
    }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Insights Dashboard</h1>
                <p className="text-gray-600 mt-1">Monitor your business performance</p>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Section</label>
              <FilterTabs
                tabs={['All', 'Restaurant', 'Ticket Counter', 'Party Sales']}
                activeTab={activeSection}
                onTabChange={setActiveSection}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <FilterTabs
                tabs={['All', 'Food', 'Activities']}
                activeTab={activeSplit}
                onTabChange={setActiveSplit}
              />
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Revenue"
            value={formatCurrency(totalRevenue)}
            icon={IndianRupee}
            color={COLORS.primary}
            trend="+12.5%"
          />
          <StatCard
            title="Total Orders"
            value={totalOrders.toLocaleString()}
            icon={BarChart3}
            color={COLORS.secondary}
            trend="+8.2%"
          />
          <StatCard
            title="Average Order Value"
            value={formatCurrency(averageOrderValue)}
            icon={TrendingUp}
            color={COLORS.accent}
            trend="+5.1%"
          />
          <StatCard
            title="Active Activities"
            value={activitiesData.length}
            icon={Activity}
            color={COLORS.purple}
          />
        </div>

        {/* Customer Insights Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Insights</h2>
          
          {/* Customer Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <StatCard
              title="Repeat Customer Rate"
              value={`${(customerInsights.repeatRate * 100).toFixed(1)}%`}
              icon={UserCheck}
              color={COLORS.secondary}
              trend="+3.2%"
            />
            <StatCard
              title="Avg Customer Order"
              value={formatCurrency(customerInsights.avgOrderValue)}
              icon={Package}
              color={COLORS.indigo}
              trend="+7.8%"
            />
            <StatCard
              title="Total Customers"
              value={customerInsights.ageGroups.reduce((sum, group) => sum + group.count, 0).toLocaleString()}
              icon={Users}
              color={COLORS.teal}
              trend="+15.3%"
            />
          </div>

          {/* Customer Analytics Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Popular Packages */}
            <ChartCard title="Most Popular Packages">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={customerInsights.popularPackages}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#6b7280" 
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    fontSize={12}
                  />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    formatter={(value) => [value, 'Sales']}
                    labelStyle={{ color: '#374151' }}
                  />
                  <Bar 
                    dataKey="sales" 
                    fill={COLORS.primary} 
                    radius={[4, 4, 0, 0]}
                    name="Sales"
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Age Distribution */}
            <ChartCard title="Customer Age Distribution">
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={customerInsights.ageGroups}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ ageRange, percent }) => `${ageRange} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {customerInsights.ageGroups.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Customers']} />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Daily Sales Trend */}
          <ChartCard title="Daily Sales Trend" className="lg:col-span-2">
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={dailySalesData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis stroke="#6b7280" tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  formatter={(value, name) => [formatCurrency(value), name === 'amount' ? 'Revenue' : 'Orders']}
                  labelStyle={{ color: '#374151' }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke={COLORS.primary}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  name="Revenue"
                />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke={COLORS.secondary}
                  strokeWidth={2}
                  name="Orders"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Section-wise Revenue */}
          <ChartCard title="Revenue by Section">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sectionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {sectionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Category Split */}
          <ChartCard title="Revenue by Category">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={splitData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tickFormatter={(value) => `$${value}`} stroke="#6b7280" />
                <YAxis dataKey="name" type="category" stroke="#6b7280" />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Bar dataKey="value" fill={COLORS.secondary} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Activities Performance */}
        <ChartCard title="Top Activities by Redemptions" className="mb-8">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={topActivities}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Legend />
              <Bar dataKey="redemptions" fill={COLORS.primary} name="Redemptions" radius={[4, 4, 0, 0]} />
              <Bar dataKey="staff" fill={COLORS.accent} name="Staff Assigned" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Detailed Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Transactions */}
          <ChartCard title="Recent Transactions">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSalesData.slice(0, 5).map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{formatDate(item.date)}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.section}</td>
                      <td className="px-4 py-3 text-sm font-medium text-green-600">{formatCurrency(item.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ChartCard>

          {/* Top Activities Details */}
          <ChartCard title="Activity Details">
            <div className="space-y-4">
              {topActivities.slice(0, 5).map((activity, index) => (
                <div key={activity.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{activity.name}</h4>
                    <p className="text-sm text-gray-600">{activity.staff} staff assigned</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-blue-600">{activity.redemptions}</p>
                    <p className="text-xs text-gray-500">redemptions</p>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>

          {/* Customer Package Preferences */}
          <ChartCard title="Package Performance">
            <div className="space-y-3">
              {customerInsights.popularPackages.slice(0, 6).map((pkg, index) => {
                const maxSales = Math.max(...customerInsights.popularPackages.map(p => p.sales));
                const percentage = (pkg.sales / maxSales) * 100;
                
                return (
                  <div key={pkg.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700 truncate">{pkg.name}</span>
                      <span className="text-sm font-semibold text-blue-600">{pkg.sales}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  );
};

export default Stats;