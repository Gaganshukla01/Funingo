import React, { useState, useEffect } from "react";
import axios from "axios";
import { apiUrl } from "../../../constants";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Calendar,
  IndianRupee,
  TrendingUp,
  PieChart as PieChartIcon,
  ChevronDown, 
  User,
  ChevronUp,
  BarChart3,
  Activity,
  Users,
  UserCheck,
  Package,
  CalendarDays,
  Filter,
  Download,
} from "lucide-react";

const styles = {
  container: {
    background: "linear-gradient(135deg, #4f46e5, #3b82f6)",
    color: "white",
    padding: "2rem 2.5rem",
    borderRadius: "12px",
    boxShadow: "0 10px 15px rgba(59, 130, 246, 0.3)",
    maxWidth: "480px",
    fontFamily: "'Poppins', sans-serif",
  },
  title: {
    fontWeight: 700,
    fontSize: "2.8rem",
    margin: 0,
    textShadow: "1px 1px 3px rgba(0,0,0,0.3)",
  },
  subtitle: {
    marginTop: "0.75rem",
    fontWeight: 500,
    fontSize: "1.15rem",
    opacity: 0.85,
    textShadow: "1px 1px 2px rgba(0,0,0,0.15)",
  },
};

// Color schemes
const COLORS = {
  primary: "#3B82F6",
  secondary: "#10B981",
  accent: "#F59E0B",
  danger: "#EF4444",
  purple: "#8B5CF6",
  pink: "#EC4899",
  indigo: "#6366F1",
  teal: "#14B8A6",
};

const PIE_COLORS = [
  COLORS.primary,
  COLORS.secondary,
  COLORS.accent,
  COLORS.danger,
  COLORS.purple,
  COLORS.pink,
];

// Utility functions
const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const handleExcel = async () => {
  try {
    const response = await axios.get(`${apiUrl}/bill/billinexcel`, {
      responseType: "blob",
    });
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "FUNINGO_BILLS.xlsx");
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading Excel file:", error);
    alert("Failed to download Excel file. Please try again.");
  }
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
};

// Date filtering utility functions
const getDateParts = (dateStr) => {
  const date = new Date(dateStr);
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1, 
    date: date.getDate(),
    fullDate: date.toISOString().split("T")[0], 
  };
};

const filterDataByDate = (data, filterType, filterValue) => {
  if (!filterValue || filterType === "all") return data;

  return data.filter((item) => {
    if (!item.date) return false;

    const itemDate = getDateParts(item.date);

    switch (filterType) {
      case "year":
        return itemDate.year === parseInt(filterValue);
      case "month":
        const [year, month] = filterValue.split("-");
        return (
          itemDate.year === parseInt(year) && itemDate.month === parseInt(month)
        );
      case "date":
        return itemDate.fullDate === filterValue;
      case "range":
        const [startDate, endDate] = filterValue.split("_");
        const itemDateObj = new Date(item.date);
        return (
          itemDateObj >= new Date(startDate) && itemDateObj <= new Date(endDate)
        );
      default:
        return true;
    }
  });
};

const getUniqueYears = (data) => {
  const years = data
    .filter((item) => item.date)
    .map((item) => getDateParts(item.date).year)
    .filter((year, index, arr) => arr.indexOf(year) === index)
    .sort((a, b) => b - a);
  return years;
};

const getUniqueMonths = (data, selectedYear = null) => {
  const months = data
    .filter((item) => {
      if (!item.date) return false;
      const itemDate = getDateParts(item.date);
      return selectedYear ? itemDate.year === parseInt(selectedYear) : true;
    })
    .map((item) => {
      const itemDate = getDateParts(item.date);
      return `${itemDate.year}-${itemDate.month.toString().padStart(2, "0")}`;
    })
    .filter((month, index, arr) => arr.indexOf(month) === index)
    .sort((a, b) => b.localeCompare(a));
  return months;
};

const formatMonthDisplay = (monthStr) => {
  const [year, month] = monthStr.split("-");
  const date = new Date(year, month - 1);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long" });
};


// per day data

const getTodaysData = (salesData) => {
  const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
  
  const todaysSales = salesData.filter((item) => {
    if (!item.date) return false;
    const itemDate = new Date(item.date).toISOString().split("T")[0];
    return itemDate === today;
  });
  
  const todaysRevenue = todaysSales.reduce((sum, item) => sum + (item.amount || 0), 0);
  const todaysOrders = todaysSales.length;
  
  return {
    revenue: todaysRevenue,
    orders: todaysOrders,
    avgOrderValue: todaysOrders > 0 ? todaysRevenue / todaysOrders : 0
  };
};



// Components
const StatCard = ({
  title,
  value,
  icon: Icon,
  color = COLORS.primary,
  trend,
}) => (
  <div
    className="bg-white rounded-xl shadow-lg p-6 border-l-4"
    style={{ borderLeftColor: color }}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        <p className="text-2xl font-bold" style={{ color }}>
          {value}
        </p>
        {trend && (
          <p className="text-sm text-green-600 flex items-center mt-1">
            <TrendingUp className="w-4 h-4 mr-1" />
            {trend}
          </p>
        )}
      </div>
      <div
        className="p-3 rounded-full"
        style={{ backgroundColor: `${color}20` }}
      >
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
            ? "bg-blue-600 text-white shadow-md"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        {tab}
      </button>
    ))}
  </div>
);

const DateFilter = ({
  filterType,
  setFilterType,
  filterValue,
  setFilterValue,
  availableYears,
  availableMonths,
  onClearFilter,
}) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleRangeChange = () => {
    if (startDate && endDate) {
      setFilterValue(`${startDate}_${endDate}`);
    }
  };

  const clearFilter = () => {
    setFilterType("all");
    setFilterValue("");
    setStartDate("");
    setEndDate("");
    onClearFilter();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-800">Date Filters</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Filter Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter By
          </label>
          <select
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setFilterValue("");
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Time</option>
            <option value="year">Year</option>
            <option value="month">Month</option>
            <option value="date">Specific Date</option>
            <option value="range">Date Range</option>
          </select>
        </div>

        {/* Year Filter */}
        {filterType === "year" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Year
            </label>
            <select
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Choose Year</option>
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Month Filter */}
        {filterType === "month" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Month
            </label>
            <select
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Choose Month</option>
              {availableMonths.map((month) => (
                <option key={month} value={month}>
                  {formatMonthDisplay(month)}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Specific Date Filter */}
        {filterType === "date" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Date
            </label>
            <input
              type="date"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}

        {/* Date Range Filter */}
        {filterType === "range" && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  if (e.target.value && endDate) {
                    setFilterValue(`${e.target.value}_${endDate}`);
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                min={startDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  if (startDate && e.target.value) {
                    setFilterValue(`${startDate}_${e.target.value}`);
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </>
        )}
      </div>

      {/* Clear Filter Button */}
      {filterType !== "all" && (
        <div className="mt-4 flex justify-start">
          <button
            onClick={clearFilter}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Clear Filter
          </button>
        </div>
      )}

      {/* Active Filter Display */}
      {filterType !== "all" && filterValue && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm font-medium text-blue-800">
            Active Filter: {filterType === "year" && `Year ${filterValue}`}
            {filterType === "month" && formatMonthDisplay(filterValue)}
            {filterType === "date" &&
              `Date ${new Date(filterValue).toLocaleDateString()}`}
            {filterType === "range" &&
              `${new Date(startDate).toLocaleDateString()} - ${new Date(
                endDate
              ).toLocaleDateString()}`}
          </p>
        </div>
      )}
    </div>
  );
};


// Updated Employee Performance Card Component
const EmployeePerformanceCard = ({ employeeData }) => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [expandedEmployee, setExpandedEmployee] = useState(null);
  const [viewMode, setViewMode] = useState('overall'); // 'overall' or 'daywise'

  // Process employee data to get performance metrics
  const getEmployeePerformance = () => {
    if (!Array.isArray(employeeData)) return [];

    return employeeData.map(employee => {
      // Calculate total redemptions for the employee
      const totalRedemptions = employee.activities?.reduce((sum, activity) => sum + (activity.count || 0), 0) || 0;
      
      // Group activities by date for day-wise view
      const activitiesByDate = employee.activities?.reduce((acc, activity) => {
        const date = activity.date;
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(activity);
        return acc;
      }, {}) || {};

      // Calculate daily totals
      const dailyTotals = Object.entries(activitiesByDate).map(([date, activities]) => ({
        date,
        totalCount: activities.reduce((sum, act) => sum + (act.count || 0), 0),
        activities: activities
      })).sort((a, b) => new Date(b.date) - new Date(a.date));

      return {
        id: employee.empid || employee._id,
        empid: employee.empid,
        name: employee.name || 'Unknown Employee',
        totalRedemptions,
        totalActivities: employee.activities?.length || 0,
        uniqueActivityNames: [...new Set(employee.activities?.map(act => act.name) || [])],
        activities: employee.activities || [],
        dailyTotals
      };
    }).sort((a, b) => b.totalRedemptions - a.totalRedemptions);
  };

  const employeePerformance = getEmployeePerformance();
  const totalEmployees = employeePerformance.length;
  const totalRedemptions = employeePerformance.reduce((sum, emp) => sum + emp.totalRedemptions, 0);

  const handleEmployeeClick = (employee) => {
    if (expandedEmployee === employee.id) {
      setExpandedEmployee(null);
    } else {
      setExpandedEmployee(employee.id);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          Employee Performance
        </h3>
        <div className="flex items-center gap-4">
          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('overall')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'overall'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Overall
            </button>
            <button
              onClick={() => setViewMode('daywise')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'daywise'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Day-wise
            </button>
          </div>
          <div className="text-sm text-gray-600">
            {totalEmployees} Employees
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{totalEmployees}</p>
          <p className="text-sm text-gray-600">Total Employees</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{totalRedemptions}</p>
          <p className="text-sm text-gray-600">Total Redemptions</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-purple-600">
            {employeePerformance.reduce((sum, emp) => sum + emp.totalActivities, 0)}
          </p>
          <p className="text-sm text-gray-600">Total Activities</p>
        </div>
      </div>

      {/* Employee List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {employeePerformance.length > 0 ? (
          employeePerformance.map((employee, index) => (
            <div key={employee.id} className="border border-gray-200 rounded-lg">
              {/* Employee Header */}
              <div 
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => handleEmployeeClick(employee)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{employee.name}</h4>
                    <p className="text-xs text-gray-500">
                      ID: {employee.empid} • Rank #{index + 1}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-semibold text-blue-600">
                      {employee.totalRedemptions}
                    </p>
                    <p className="text-xs text-gray-500">redemptions</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-purple-600">
                      {employee.totalActivities}
                    </p>
                    <p className="text-xs text-gray-500">activities</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-orange-600">
                      {employee.uniqueActivityNames.length}
                    </p>
                    <p className="text-xs text-gray-500">unique types</p>
                  </div>
                  {expandedEmployee === employee.id ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Expanded Details */}
              {expandedEmployee === employee.id && (
                <div className="border-t border-gray-200 bg-gray-50">
                  <div className="p-4">
                    {viewMode === 'overall' ? (
                      // Overall Activity View
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                          <Activity className="w-4 h-4" />
                          Activity Breakdown ({employee.totalActivities} activities)
                        </h5>
                        
                        {employee.activities.length > 0 ? (
                          <div className="space-y-2 max-h-48 overflow-y-auto">
                            {employee.activities.map((activity, actIndex) => (
                              <div 
                                key={`${activity._id || actIndex}-${actIndex}`}
                                className="flex items-center justify-between py-2 px-3 bg-white rounded border"
                              >
                                <div className="flex-1">
                                  <span className="text-sm text-gray-700 font-medium block">
                                    {activity.name || 'Unknown Activity'}
                                  </span>
                                  {activity.date && (
                                    <span className="text-xs text-gray-500">
                                      {new Date(activity.date).toLocaleDateString()}
                                    </span>
                                  )}
                                </div>
                                <span className="text-sm font-semibold text-green-600 ml-2">
                                  {activity.count || 0} redemptions
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500 italic">
                            No activities assigned
                          </p>
                        )}
                      </div>
                    ) : (
                      // Day-wise Activity View
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                          <CalendarDays className="w-4 h-4" />
                          Day-wise Performance ({employee.dailyTotals.length} days)
                        </h5>
                        
                        {employee.dailyTotals.length > 0 ? (
                          <div className="space-y-3 max-h-48 overflow-y-auto">
                            {employee.dailyTotals.map((dayData, dayIndex) => (
                              <div key={`${dayData.date}-${dayIndex}`} className="bg-white rounded border p-3">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-medium text-gray-700">
                                    {new Date(dayData.date).toLocaleDateString('en-US', {
                                      weekday: 'short',
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric'
                                    })}
                                  </span>
                                  <span className="text-sm font-semibold text-blue-600">
                                    {dayData.totalCount} total redemptions
                                  </span>
                                </div>
                                
                                {/* Activities for this day */}
                                <div className="space-y-1">
                                  {dayData.activities.map((activity, actIndex) => (
                                    <div 
                                      key={`${activity._id || actIndex}-day-${actIndex}`}
                                      className="flex items-center justify-between py-1 px-2 bg-gray-50 rounded text-xs"
                                    >
                                      <span className="text-gray-600">
                                        {activity.name || 'Unknown Activity'}
                                      </span>
                                      <span className="font-medium text-green-600">
                                        {activity.count || 0}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500 italic">
                            No daily data available
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
              <Users className="w-12 h-12 mx-auto" />
            </div>
            <p className="text-gray-500">No employee data available</p>
            <p className="text-xs text-gray-400 mt-1">
              Check if employee data is being fetched correctly
            </p>
          </div>
        )}
      </div>

      {/* Top Performer Highlight */}
      {employeePerformance.length > 0 && employeePerformance[0].totalRedemptions > 0 && (
        <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">👑</span>
            </div>
            <span className="text-sm font-medium text-yellow-800">Top Performer</span>
          </div>
          <p className="text-sm text-gray-700">
            <span className="font-semibold">{employeePerformance[0].name}</span> leads with{' '}
            <span className="font-semibold text-yellow-700">
              {employeePerformance[0].totalRedemptions} redemptions
            </span>
            {' '}across {employeePerformance[0].totalActivities} activities
          </p>
        </div>
      )}

      {/* Performance Distribution Chart */}
      {employeePerformance.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Performance Distribution</h4>
          <div className="space-y-2">
            {employeePerformance.slice(0, 5).map((employee, index) => {
              const maxRedemptions = employeePerformance[0].totalRedemptions;
              const percentage = maxRedemptions > 0 ? (employee.totalRedemptions / maxRedemptions) * 100 : 0;
              
              return (
                <div key={employee.id} className="flex items-center gap-3">
                  <div className="w-20 text-xs text-gray-600 truncate">
                    {employee.name}
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="w-12 text-xs text-gray-600 text-right">
                    {employee.totalRedemptions}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};


// for present day data
const TodaysStatsCard = ({ salesData }) => {
  const todaysData = getTodaysData(salesData);
  
  return (
    <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Today's Performance</h3>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold">{formatCurrency(todaysData.revenue)}</p>
          <p className="text-sm opacity-80">Revenue</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold">{todaysData.orders}</p>
          <p className="text-sm opacity-80">Orders</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold">{formatCurrency(todaysData.avgOrderValue)}</p>
          <p className="text-sm opacity-80">Avg Order</p>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-white/20">
        <p className="text-sm opacity-80">
          {new Date().toLocaleDateString("en-US", { 
            weekday: "long", 
            year: "numeric", 
            month: "long", 
            day: "numeric" 
          })}
        </p>
      </div>
    </div>
  );
};




const PaymentAnalyticsCard = ({ salesData }) => {
  
  const normalizeDate = (dateString) => {
    if (!dateString) return null;
    
    let date;
    if (dateString.includes('/')) {
      const parts = dateString.split('/');
      if (parts.length === 3) {
        const month = parts[0].padStart(2, '0');
        const day = parts[1].padStart(2, '0');
        const year = parts[2];
        date = new Date(`${year}-${month}-${day}`);
      }
    } else {
      
      date = new Date(dateString);
    }
    
    if (isNaN(date.getTime())) return null;
    
    return date.toISOString().split("T")[0];
  };
  
  const today = new Date().toISOString().split("T")[0];
  
  const extractPaymentTypes = (paymentTypeString) => {
    if (!paymentTypeString) return [];
    
    const types = paymentTypeString.trim().split(/\s+/).filter(type => type);
    return types.map(type => type.toLowerCase());
  };
  
  // Calculate today's payment breakdown
  const getTodaysPaymentBreakdown = () => {
    const todaysSales = salesData.filter((item) => {
      if (!item.Date) return false;
      const normalizedDate = normalizeDate(item.Date);
      return normalizedDate === today;
    });
    
    const breakdown = {
      cash: 0,
      card: 0,
      online: 0,
    };
    
    todaysSales.forEach(item => {
      const amount = parseFloat(item.amount) || 0;
      const cashAmount = parseFloat(item.CashAmount) || 0;
      const onlineAmount = parseFloat(item.OnlineAmount) || 0;
      const paymentTypes = extractPaymentTypes(item.paymentType);
      
      const paymentTypeStr = item.paymentType?.trim().toLowerCase();
      if (paymentTypeStr === 'cash online') {
        breakdown.cash += cashAmount;
        breakdown.online += onlineAmount;
      } else {
        paymentTypes.forEach(type => {
          if (type === 'cash') breakdown.cash += amount;
          else if (type === 'card') breakdown.card += amount;
          else if (type === 'online') breakdown.online += amount;
        });
      }
    });
    
    return breakdown;
  };
  
  const getOverallPaymentBreakdown = () => {
    const breakdown = {
      cash: 0,
      card: 0,
      online: 0
    };
    
    salesData.forEach(item => {
      const amount = parseFloat(item.amount) || 0;
      const cashAmount = parseFloat(item.CashAmount) || 0;
      const onlineAmount = parseFloat(item.OnlineAmount) || 0;
      const paymentTypes = extractPaymentTypes(item.paymentType);
      
      const paymentTypeStr = item.paymentType?.trim().toLowerCase();
      if (paymentTypeStr === 'cash online') {
        breakdown.cash += cashAmount;
        breakdown.online += onlineAmount;
      } else {
        paymentTypes.forEach(type => {
          if (type === 'cash') breakdown.cash += amount;
          else if (type === 'card') breakdown.card += amount;
          else if (type === 'online') breakdown.online += amount;
        });
      }
    });
    
    return breakdown;
  };
  
  const todaysBreakdown = getTodaysPaymentBreakdown();
  const overallBreakdown = getOverallPaymentBreakdown();
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };
  
  return (
    <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Payment Analytics</h3>
        <div className="flex items-center gap-1">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </div>
      </div>
      
      {/* Today's Breakdown */}
      <div className="mb-6">
        <h4 className="text-sm font-medium mb-3 opacity-90">Today's Revenue</h4>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center bg-white/10 rounded-lg p-3">
            <p className="text-xl font-bold">{formatCurrency(todaysBreakdown.cash)}</p>
            <p className="text-xs opacity-80">Cash</p>
          </div>
          <div className="text-center bg-white/10 rounded-lg p-3">
            <p className="text-xl font-bold">{formatCurrency(todaysBreakdown.card)}</p>
            <p className="text-xs opacity-80">Card</p>
          </div>
          <div className="text-center bg-white/10 rounded-lg p-3">
            <p className="text-xl font-bold">{formatCurrency(todaysBreakdown.online)}</p>
            <p className="text-xs opacity-80">Online</p>
          </div>
        </div>
      </div>
      
      {/* Overall Breakdown */}
      <div className="border-t border-white/20 pt-4">
        <h4 className="text-sm font-medium mb-3 opacity-90">Overall Revenue</h4>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <p className="text-lg font-bold">{formatCurrency(overallBreakdown.cash)}</p>
            <p className="text-xs opacity-80">Cash</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold">{formatCurrency(overallBreakdown.card)}</p>
            <p className="text-xs opacity-80">Card</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold">{formatCurrency(overallBreakdown.online)}</p>
            <p className="text-xs opacity-80">Online</p>
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-white/20">
        <p className="text-sm opacity-80">
          {new Date().toLocaleDateString("en-US", { 
            weekday: "long", 
            year: "numeric", 
            month: "long", 
            day: "numeric" 
          })}
        </p>
      </div>
    </div>
  );
};


const ChartCard = ({ title, children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
    <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
    {children}
  </div>
);

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

// Error component
const ErrorMessage = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center h-64 text-center">
    <div className="text-red-500 mb-4">
      <svg
        className="w-16 h-16 mx-auto"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">
      Error Loading Data
    </h3>
    <p className="text-gray-600 mb-4">{message}</p>
    <button
      onClick={onRetry}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
      Retry
    </button>
  </div>
);

// Main Dashboard Component
const Stats = () => {
  // State management
  const [salesData, setSalesData] = useState([]);
  const [transactionData, setTransactionData] = useState([]);
  const [activitiesData, setActivitiesData] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);
  const [customerInsights, setCustomerInsights] = useState({
    popularPackages: [],
    ageGroups: [],
    repeatRate: 0,
    avgOrderValue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("All");
  const [activeSplit, setActiveSplit] = useState("All");

  // Date filtering states
  const [dateFilterType, setDateFilterType] = useState("all");
  const [dateFilterValue, setDateFilterValue] = useState("");
  const [availableYears, setAvailableYears] = useState([]);
  const [availableMonths, setAvailableMonths] = useState([]);

  // Fetch data from API with optional date filters
  const fetchData = async (dateFilter = null) => {
    try {
      setLoading(true);
      setError(null);

      // Prepare API parameters for date filtering
      const params = {};
      if (dateFilter) {
        params.dateFilter = dateFilter;
      }

      // Parallel API calls for better performance
      const [salesResponse, activitiesResponse, insightsResponse,employeeResponse,transactionResponse] =
        await Promise.all([
          axios.get(`${apiUrl}/insights/salesfetch`, { params }),
          axios.get(`${apiUrl}/insights/activityfetch`, { params }),
          axios.get(`${apiUrl}/insights/customerinsightfetch`, { params }),
          axios.get(`${apiUrl}/insights/employeefetch`, { params }),
          axios.get(`${apiUrl}/bill/billfetch`, { params }),
        ]);
     
      // Set data with proper validation
      const salesDataArray = Array.isArray(salesResponse.data)
        ? salesResponse.data
        : [];
      const transactionDataArray = Array.isArray(transactionResponse.data.data) 
      ? transactionResponse.data.data 
      : [];
      const activitiesDataArray = Array.isArray(activitiesResponse.data)
        ? activitiesResponse.data
        : [];
        const employeeDataArray = Array.isArray(employeeResponse.data)
      ? employeeResponse.data
      : [];
        console.log(transactionResponse.data,"i am in transactiondataarray")
      setSalesData(salesDataArray);
      setTransactionData(transactionDataArray)
      setActivitiesData(activitiesDataArray);
      setEmployeeData(employeeDataArray); 
      setAvailableYears(getUniqueYears(salesDataArray));
      setAvailableMonths(getUniqueMonths(salesDataArray));

      // Handle customer insights data structure
    const insights = insightsResponse.data;
const insightData = insights[0] || {}; // Get the first object from the array

setCustomerInsights({
  popularPackages: Array.isArray(insightData.popularPackages)
    ? insightData.popularPackages
    : [],
  ageGroups: Array.isArray(insightData.ageGroups) 
    ? insightData.ageGroups 
    : [],
  repeatRate: typeof insightData.repeatRate === "number" 
    ? insightData.repeatRate 
    : 0,
  avgOrderValue: typeof insightData.avgOrderValue === "number"
    ? insightData.avgOrderValue
    : 0,
});
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch data from server"
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle date filter changes
  const handleDateFilterChange = () => {
    if (dateFilterType === "all") {
      fetchData();
    } else {
      const filterObj = {
        type: dateFilterType,
        value: dateFilterValue,
      };
      fetchData(filterObj);
    }
  };

  // Clear date filters
  const clearDateFilter = () => {
    setDateFilterType("all");
    setDateFilterValue("");
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Apply date filter whenever filter values change
  useEffect(() => {
    if (dateFilterValue || dateFilterType === "all") {
      handleDateFilterChange();
    }
  }, [dateFilterType, dateFilterValue]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ErrorMessage message={error} onRetry={fetchData} />
      </div>
    );
  }

  // Apply client-side date filtering for immediate UI updates
  const dateFilteredSalesData = filterDataByDate(
    salesData,
    dateFilterType,
    dateFilterValue
  );
  const dateFilteredActivitiesData = filterDataByDate(
    activitiesData,
    dateFilterType,
    dateFilterValue
  );

  // Filter data based on section and split selections
  const filteredSalesData = dateFilteredSalesData.filter((item) => {
    const sectionMatch =
      activeSection === "All" || item.section === activeSection;
    const splitMatch = activeSplit === "All" || item.split === activeSplit;
    return sectionMatch && splitMatch;
  });

  // Calculate metrics
  const totalRevenue = filteredSalesData.reduce(
    (sum, item) => sum + (item.amount || 0),
    0
  );
  const totalOrders = filteredSalesData.length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Get unique sections and splits from filtered data
  const availableSections = [
    "All",
    ...new Set(
      dateFilteredSalesData.map((item) => item.section).filter(Boolean)
    ),
  ];
  const availableSplits = [
    "All",
    ...new Set(dateFilteredSalesData.map((item) => item.split).filter(Boolean)),
  ];

  // Prepare chart data
  const dailySalesData = filteredSalesData
    .reduce((acc, item) => {
      const date = formatDate(item.date);
      const existing = acc.find((d) => d.date === date);
      if (existing) {
        existing.amount += item.amount || 0;
        existing.orders += 1;
      } else {
        acc.push({ date, amount: item.amount || 0, orders: 1 });
      }
      return acc;
    }, [])
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // Section-wise revenue
  const sectionData = filteredSalesData.reduce((acc, item) => {
    if (!item.section) return acc;
    const existing = acc.find((d) => d.name === item.section);
    if (existing) {
      existing.value += item.amount || 0;
    } else {
      acc.push({ name: item.section, value: item.amount || 0 });
    }
    return acc;
  }, []);

  // Split-wise revenue
  const splitData = filteredSalesData.reduce((acc, item) => {
    if (!item.split) return acc;
    const existing = acc.find((d) => d.name === item.split);
    if (existing) {
      existing.value += item.amount || 0;
    } else {
      acc.push({ name: item.split, value: item.amount || 0 });
    }
    return acc;
  }, []);


  // Top activities by redemptions (with date filtering)
  const topActivities = [...dateFilteredActivitiesData]
    .sort((a, b) => (b.redemptions || 0) - (a.redemptions || 0))
    .slice(0, 5)
    .map((activity) => ({
      name: activity.name || "Unknown Activity",
      redemptions: activity.redemptions || 0,
      staff: Array.isArray(activity.assignedPeople)
        ? activity.assignedPeople.length
        : 0,
    }));

  // Calculate total customers from age groups
  const totalCustomers = customerInsights.ageGroups.reduce(
    (sum, group) => sum + (group.count || 0),
    0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div style={styles.container}>
                <h1 style={styles.title}>Dashboard</h1>
                <p style={styles.subtitle}>Monitor your business performance</p>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={fetchData}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  Refresh
                </button>

                <button
                  onClick={handleExcel}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Sales Data
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Date Filter Section */}
        <DateFilter
          filterType={dateFilterType}
          setFilterType={setDateFilterType}
          filterValue={dateFilterValue}
          setFilterValue={setDateFilterValue}
          availableYears={availableYears}
          availableMonths={availableMonths}
          onClearFilter={clearDateFilter}
        />

        {/* Section and Split Filters */}
        {dateFilteredSalesData.length > 0 && (
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Section
                </label>
                <FilterTabs
                  tabs={availableSections}
                  activeTab={activeSection}
                  onTabChange={setActiveSection}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <FilterTabs
                  tabs={availableSplits}
                  activeTab={activeSplit}
                  onTabChange={setActiveSplit}
                />
              </div>
            </div>
          </div>
        )}

       <div className="mb-10"> 
        <TodaysStatsCard salesData={salesData} />
       </div>

       <div className="mb-10"> 
        {console.log(transactionData,"in ttttttt")}
         <PaymentAnalyticsCard salesData={transactionData} />
       </div>
        

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Revenue"
            value={formatCurrency(totalRevenue)}
            icon={IndianRupee}
            color={COLORS.primary}
          />
          <StatCard
            title="Total Orders"
            value={totalOrders.toLocaleString()}
            icon={BarChart3}
            color={COLORS.secondary}
          />
          <StatCard
            title="Average Order Value"
            value={formatCurrency(averageOrderValue)}
            icon={TrendingUp}
            color={COLORS.accent}
          />
          <StatCard
            title="Active Activities"
            value={dateFilteredActivitiesData.length}
            icon={Activity}
            color={COLORS.purple}
          />
        </div>
 
        
       {/* Employee Performance */}
{employeeData.length > 0 && (
  <EmployeePerformanceCard employeeData={employeeData} />
)}

        {/* Customer Insights Section */}
        {(customerInsights.ageGroups.length > 0 ||
          customerInsights.popularPackages.length > 0) && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Customer Insights
            </h2>

            {/* Customer Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <StatCard
                title="Repeat Customer Rate"
                value={`${(customerInsights.repeatRate * 100).toFixed(1)}%`}
                icon={UserCheck}
                color={COLORS.secondary}
              />
              <StatCard
                title="Avg Customer Order"
                value={formatCurrency(customerInsights.avgOrderValue)}
                icon={Package}
                color={COLORS.indigo}
              />
              <StatCard
                title="Total Customers"
                value={totalCustomers.toLocaleString()}
                icon={Users}
                color={COLORS.teal}
              />
            </div>

            {/* Customer Analytics Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Popular Packages */}
              {customerInsights.popularPackages.length > 0 && (
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
                        formatter={(value) => [value, "Sales"]}
                        labelStyle={{ color: "#374151" }}
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
              )}

              {/* Age Distribution */}
              {customerInsights.ageGroups.length > 0 && (
                <ChartCard title="Customer Age Distribution">
                  <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                      <Pie
                        data={customerInsights.ageGroups}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ ageRange, percent }) =>
                          `${ageRange} (${(percent * 100).toFixed(0)}%)`
                        }
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {customerInsights.ageGroups.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={PIE_COLORS[index % PIE_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [value, "Customers"]} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartCard>
              )}
            </div>
          </div>
        )}

        {/* Charts Grid */}
        {filteredSalesData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Daily Sales Trend */}
            <ChartCard title="Daily Sales Trend" className="lg:col-span-2">
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={dailySalesData}>
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={COLORS.primary}
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor={COLORS.primary}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" stroke="#6b7280" />
                  <YAxis
                    stroke="#6b7280"
                    tickFormatter={(value) => `₹${value}`}
                  />
                  <Tooltip
                    formatter={(value, name) => [
                      formatCurrency(value),
                      name === "amount" ? "Revenue" : "Orders",
                    ]}
                    labelStyle={{ color: "#374151" }}
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
            {sectionData.length > 0 && (
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
                        <Cell
                          key={`cell-${index}`}
                          fill={PIE_COLORS[index % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>
            )}

            {/* Category Split */}
            {splitData.length > 0 && (
              <ChartCard title="Revenue by Category">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={splitData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      type="number"
                      tickFormatter={(value) => `₹${value}`}
                      stroke="#6b7280"
                    />
                    <YAxis dataKey="name" type="category" stroke="#6b7280" />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Bar
                      dataKey="value"
                      fill={COLORS.secondary}
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            )}
          </div>
        )}

        {/* Activities Performance */}
        {topActivities.length > 0 && (
          <ChartCard title="Top Activities by Redemptions" className="mb-8">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={topActivities}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="redemptions"
                  fill={COLORS.primary}
                  name="Redemptions"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="staff"
                  fill={COLORS.accent}
                  name="Staff Assigned"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        )}

        {/* Detailed Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Transactions */}
          {filteredSalesData.length > 0 && (
            <ChartCard title="Recent Transactions">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Section
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredSalesData.slice(0, 5).map((item) => (
                      <tr key={item._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {formatDate(item.date)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {item.section || "N/A"}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-green-600">
                          {formatCurrency(item.amount || 0)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ChartCard>
          )}

          {/* Top Activities Details */}
          {topActivities.length > 0 && (
            <ChartCard title="Activity Details">
              <div className="space-y-4">
                {topActivities.slice(0, 5).map((activity, index) => (
                  <div
                    key={activity.name}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {activity.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {activity.staff} staff assigned
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-blue-600">
                        {activity.redemptions}
                      </p>
                      <p className="text-xs text-gray-500">redemptions</p>
                    </div>
                  </div>
                ))}
              </div>
            </ChartCard>
          )}

          {/* Customer Package Preferences */}
          {console.log(customerInsights,"i am gere")}
          {customerInsights.popularPackages.length > 0 && (
            <ChartCard title="Package Performance">
              <div className="space-y-3">
                {customerInsights.popularPackages
                  .slice(0, 6)
                  .map((pkg, index) => {
                    const maxSales = Math.max(
                      ...customerInsights.popularPackages.map(
                        (p) => p.sales || 0
                      )
                    );
                    const percentage =
                      maxSales > 0 ? ((pkg.sales || 0) / maxSales) * 100 : 0;

                    return (
                      <div key={pkg.name || index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700 truncate">
                            {pkg.name || "Unknown Package"}
                          </span>
                          <span className="text-sm font-semibold text-blue-600">
                            {pkg.sales || 0}
                          </span>
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
          )}
        </div>

        {/* No Data Message */}
        {salesData.length === 0 &&
          activitiesData.length === 0 &&
          customerInsights.popularPackages.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Data Available
              </h3>
              <p className="text-gray-600">
                There's no data to display at the moment. Please check back
                later or refresh the page.
              </p>
            </div>
          )}
      </div>
    </div>
  );
};

export default Stats;
