import React, { useState, useEffect } from 'react';
import axios from "axios";
import { apiUrl } from '../../constants';
import { useSelector } from "react-redux";
import { User, Clock, Coins, X, Activity, Briefcase, Search, Phone, Users, Gift } from 'lucide-react';

const UserCardsDashboard = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [activeTab, setActiveTab] = useState('user');
  const [activeSection, setActiveSection] = useState('users');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [employeeSearchQuery, setEmployeeSearchQuery] = useState('');
  const [userData, setUserData] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useSelector((state) => state.userSlice);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${apiUrl}/user/getallusers`,{
          headers: {
            token: token,
            "Content-Type": "application/json",
          },
        }
            
        );
        const allData = response.data.users;
        console.log(allData,"usertrack")
       
        const users = allData.filter(item => item.user_type === 'customer');
        const employees = allData.filter(item => item.user_type === 'employee' || item.user_type === 'admin' || item.user_type === 'window_employee' );
        
        const transformedUsers = users.map(user => ({
          id: user._id,
          name: `${user.first_name} ${user.last_name}`,
          email: user.email,
          phone: user.phone_no,
          avatar: user.first_name.charAt(0) + user.last_name.charAt(0),
          totalCoins: user.funingo_money || 0,
          status: user.premium && user.premium.length > 0 ? 'premium' : 'active',
          city: user.city,
          state: user.state,
          dob: user.dob,
          gender: user.gender,
          verified: user.verified,
          regDate: user.reg_date,
          bookedTickets: user.booked_tickets?.length || 0,
          shortId: user.short_id,
          userHistory: user.history?.map(h => ({
            id: h._id,
            activity: h.activity,
            coinsUsed: parseInt(h.coins),
            date: new Date(h.timestamp).toLocaleDateString(),
            time: new Date(h.timestamp).toLocaleTimeString(),
            employee: h.redeemBy 
          })) || [],
          employeeHistory: []
        }));

        const transformedEmployees = employees.map(emp => ({
          id: emp._id,
          name: `${emp.first_name} ${emp.last_name}`,
          email: emp.email,
          phone: emp.phone_no,
          avatar: emp.first_name.charAt(0) + emp.last_name.charAt(0),
          department: emp.user_type === 'admin' ? 'Administration' : 'Employee',
          empId: emp.emp_id,
          totalRedeemed: 0, 
          status: emp.verified ? 'active' : 'inactive',
          city: emp.city,
          state: emp.state,
          redemptionHistory: []
        }));

        const employeeMap = {};
        transformedEmployees.forEach(emp => {
          if (emp.empId) {
            employeeMap[emp.empId] = emp;
          }
        });

        // Process redemption history and link employees to users
        transformedUsers.forEach(user => {
          user.userHistory.forEach(activity => {
            if (activity.employee && employeeMap[activity.employee]) {
              const employee = employeeMap[activity.employee];
              
             
              employee.redemptionHistory.push({
                id: activity.id,
                item: activity.activity,
                coinsRedeemed: activity.coinsUsed,
                forUser: user.name,
                userId: user.id,
                date: activity.date,
                time: activity.time,
                userPhone: user.phone
              });
              
             
              user.employeeHistory.push({
                id: activity.id,
                activity: activity.activity,
                coinsUsed: activity.coinsUsed,
                date: activity.date,
                time: activity.time,
                employee: employee.name
              });
            }
          });
        });

        // Calculated total redeemed for each employee
        transformedEmployees.forEach(emp => {
          emp.totalRedeemed = emp.redemptionHistory.reduce((total, item) => total + item.coinsRedeemed, 0);
        });

        setUserData(transformedUsers);
        setEmployeeData(transformedEmployees);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter users based on search query
  const filteredUsers = userData.filter(user => 
    user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    user.phone.includes(userSearchQuery) ||
    user.city.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    user.state.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  // Filter employees based on search query
  const filteredEmployees = employeeData.filter(employee => 
    employee.name.toLowerCase().includes(employeeSearchQuery.toLowerCase()) ||
    employee.email.toLowerCase().includes(employeeSearchQuery.toLowerCase()) ||
    employee.phone.includes(employeeSearchQuery) ||
    employee.department.toLowerCase().includes(employeeSearchQuery.toLowerCase()) ||
    (employee.empId && employee.empId.toLowerCase().includes(employeeSearchQuery.toLowerCase()))
  );

  const UserCard = ({ user }) => (
    <div 
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 cursor-pointer border border-gray-100 hover:border-blue-200 transform hover:-translate-y-1"
      onClick={() => {
        setSelectedUser(user);
        setActiveTab('user');
      }}
    >
      <div className="flex items-center space-x-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
          user.status === 'premium' ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gradient-to-r from-blue-500 to-indigo-500'
        }`}>
          {user.avatar}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-lg">{user.name}</h3>
          <p className="text-gray-600 text-sm">{user.email}</p>
          <div className="flex items-center space-x-1 text-gray-500 text-sm mt-1">
            <Phone size={12} />
            <span>{user.phone}</span>
          </div>
          <p className="text-gray-500 text-xs">{user.city}, {user.state}</p>
        </div>
        <div className="text-right">
          <div className="flex items-center space-x-1 text-amber-600">
            <Coins size={16} />
            <span className="font-bold">{user.totalCoins}</span>
          </div>
          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
            user.status === 'premium' 
              ? 'bg-purple-100 text-purple-800' 
              : 'bg-green-100 text-green-800'
          }`}>
            {user.status}
          </span>
          {user.bookedTickets > 0 && (
            <p className="text-xs text-gray-500 mt-1">Tickets: {user.bookedTickets}</p>
          )}
        </div>
      </div>
    </div>
  );

  const EmployeeCard = ({ employee }) => (
    <div 
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 cursor-pointer border border-gray-100 hover:border-green-200 transform hover:-translate-y-1"
      onClick={() => setSelectedEmployee(employee)}
    >
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center text-white font-bold text-lg">
          {employee.avatar}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-lg">{employee.name}</h3>
          <p className="text-gray-600 text-sm">{employee.email}</p>
          <div className="flex items-center space-x-1 text-gray-500 text-sm mt-1">
            <Phone size={12} />
            <span>{employee.phone}</span>
          </div>
          <p className="text-teal-600 text-sm font-medium">{employee.department}</p>
          {employee.empId && (
            <p className="text-xs text-gray-500">ID: {employee.empId}</p>
          )}
        </div>
        <div className="text-right">
          <div className="flex items-center space-x-1 text-green-600">
            <Gift size={16} />
            <span className="font-bold">{employee.totalRedeemed}</span>
          </div>
          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
            employee.status === 'active' 
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {employee.status}
          </span>
        </div>
      </div>
    </div>
  );

  const HistoryItem = ({ item, showEmployee = false }) => (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-gray-900">{item.activity}</h4>
        <div className="flex items-center space-x-1 text-amber-600 font-bold">
          <Coins size={14} />
          <span>{item.coinsUsed}</span>
        </div>
      </div>
      {showEmployee && item.employee && (
        <>
        <p className="text-sm text-blue-600 mb-1">By: {item.employee}</p>
        {/* here i have to upadte the field for emp id */}
        <p className="text-sm text-blue-600 mb-1">By: {item.empId}</p>
        </>
      )}
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <Clock size={12} />
        <span>{item.date} at {item.time}</span>
      </div>
    </div>
  );

  const RedemptionItem = ({ item }) => (
    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-gray-900">{item.item}</h4>
        <div className="flex items-center space-x-1 text-green-600 font-bold">
          <Gift size={14} />
          <span>{item.coinsRedeemed}</span>
        </div>
      </div>
      <p className="text-sm text-blue-600 mb-1">For: {item.forUser}</p>
      <p className="text-sm text-gray-600 mb-1">Phone: {item.userPhone}</p>
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <Clock size={12} />
        <span>{item.date} at {item.time}</span>
      </div>
    </div>
  );

  const calculateTotal = (history) => {
    return history.reduce((total, item) => total + (item.coinsUsed || item.coinsRedeemed), 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <X size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Data</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Manage users and employees with their activity history</p>
          <div className="mt-2 text-sm text-gray-500">
            Users: {userData.length} | Employees: {employeeData.length}
          </div>
        </div>

        {/* Section Toggle */}
        <div className="mb-6">
          <div className="flex bg-white rounded-lg p-1 shadow-md w-fit">
            <button
              onClick={() => setActiveSection('users')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-md font-medium transition-all ${
                activeSection === 'users'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <User size={18} />
              <span>Users ({userData.length})</span>
            </button>
            <button
              onClick={() => setActiveSection('employees')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-md font-medium transition-all ${
                activeSection === 'employees'
                  ? 'bg-green-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Users size={18} />
              <span>Employees ({employeeData.length})</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder={activeSection === 'users' 
                ? "Search users by name, email, phone, or location..." 
                : "Search employees by name, email, phone, department, or ID..."
              }
              value={activeSection === 'users' ? userSearchQuery : employeeSearchQuery}
              onChange={(e) => activeSection === 'users' 
                ? setUserSearchQuery(e.target.value)
                : setEmployeeSearchQuery(e.target.value)
              }
              className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {activeSection === 'users' 
            ? filteredUsers.map(user => <UserCard key={user.id} user={user} />)
            : filteredEmployees.map(employee => <EmployeeCard key={employee.id} employee={employee} />)
          }
        </div>

        {/* No Results Message */}
        {((activeSection === 'users' && filteredUsers.length === 0 && userSearchQuery) ||
          (activeSection === 'employees' && filteredEmployees.length === 0 && employeeSearchQuery)) && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600">Try adjusting your search terms</p>
          </div>
        )}

        {/* User Popover Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-white font-bold text-xl">
                      {selectedUser.avatar}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{selectedUser.name}</h2>
                      <p className="text-blue-100">{selectedUser.email}</p>
                      <div className="flex items-center space-x-1 text-blue-100 mt-1">
                        <Phone size={14} />
                        <span>{selectedUser.phone}</span>
                      </div>
                      <p className="text-blue-100">{selectedUser.city}, {selectedUser.state}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        <Coins size={16} />
                        <span className="font-semibold">Total: {selectedUser.totalCoins} coins</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedUser(null)}
                    className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              <div className="border-b border-gray-200">
                <div className="flex">
                  <button
                    onClick={() => setActiveTab('user')}
                    className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                      activeTab === 'user'
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <Activity size={18} />
                      <span>User Activities ({selectedUser.userHistory.length})</span>
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab('employee')}
                    className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                      activeTab === 'employee'
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <Briefcase size={18} />
                      <span>Employee Activities ({selectedUser.employeeHistory.length})</span>
                    </div>
                  </button>
                </div>
              </div>

              <div className="p-6 max-h-96 overflow-y-auto">
                {activeTab === 'user' && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">User Activity History</h3>
                      <div className="flex items-center space-x-1 text-amber-600 font-bold">
                        <Coins size={16} />
                        <span>Total Used: {calculateTotal(selectedUser.userHistory)}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {selectedUser.userHistory.length > 0 ? (
                        selectedUser.userHistory.map(item => (
                          <HistoryItem key={item.id} item={item} />
                        ))
                      ) : (
                        <p className="text-gray-500 text-center py-8">No user activities found</p>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'employee' && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Employee Activity History</h3>
                      <div className="flex items-center space-x-1 text-amber-600 font-bold">
                        <Coins size={16} />
                        <span>Total Used: {calculateTotal(selectedUser.employeeHistory)}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {selectedUser.employeeHistory.length > 0 ? (
                        selectedUser.employeeHistory.map(item => (
                          <HistoryItem key={item.id} item={item} showEmployee={true} />
                        ))
                      ) : (
                        <p className="text-gray-500 text-center py-8">No employee activities found</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Employee Popover Modal */}
        {selectedEmployee && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6 text-white">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-white font-bold text-xl">
                      {selectedEmployee.avatar}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{selectedEmployee.name}</h2>
                      <p className="text-green-100">{selectedEmployee.email}</p>
                      <div className="flex items-center space-x-1 text-green-100 mt-1">
                        <Phone size={14} />
                        <span>{selectedEmployee.phone}</span>
                      </div>
                      <p className="text-green-100 font-medium">{selectedEmployee.department}</p>
                      {selectedEmployee.empId && (
                        <p className="text-green-100">ID: {selectedEmployee.empId}</p>
                      )}
                      <div className="flex items-center space-x-1 mt-1">
                        <Gift size={16} />
                        <span className="font-semibold">Total Redeemed: {selectedEmployee.totalRedeemed} coins</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedEmployee(null)}
                    className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              <div className="p-6 max-h-96 overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Redemption History</h3>
                  <div className="flex items-center space-x-1 text-green-600 font-bold">
                    <Gift size={16} />
                    <span>Total Redeemed: {calculateTotal(selectedEmployee.redemptionHistory)}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  {selectedEmployee.redemptionHistory.length > 0 ? (
                    selectedEmployee.redemptionHistory.map(item => (
                      <RedemptionItem key={item.id} item={item} />
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-8">No redemption history found</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCardsDashboard;