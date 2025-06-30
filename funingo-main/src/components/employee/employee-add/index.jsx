import React, { useState, useEffect } from "react";
import { apiUrl } from "../../../constants";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import { ToastContainer, toast } from "react-toastify";
import {
  Plus,
  Minus,
  Trash2,
  X,
  User,
  Phone,
  Briefcase,
  UserCheck,
  Users,
  Target,
  Calendar,
  CheckSquare,
  Package,
  Activity,
  DollarSign,
  Gift,
  Clock,
} from "lucide-react";

const ActivityAssignment = ({ onSubmit }) => {
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedEmployeeName, setSelectedEmployeeName] = useState("");
  const [selectedActivity, setSelectedActivity] = useState("");
  const [activities, setActivities] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const activitiesResponse = await axios.get(
          `${apiUrl}/activity/activityfetch`
        );
        setActivities(activitiesResponse.data || []);

        const employeesResponse = await axios.get(
          `${apiUrl}/insights/employeefetch`
        );
        setEmployees(employeesResponse.data || []);
      } catch (error) {
        setError("Error fetching data. Please try again.");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  console.log(employees, "emp");
  console.log(activities, "act");

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");

    try {
      if (!selectedEmployee || !selectedActivity) {
        setError("Please fill in all required fields");
        setSubmitting(false);
        return;
      }

      const assignmentData = {
        employeeId: selectedEmployee,
        activityId: selectedActivity,
      };
      const resperassign = await axios.post(`${apiUrl}/insights/activityassignpeople`, {
        activityName: selectedActivity,
        assignedPersonName: selectedEmployeeName,
        count: 0
      });
      console.log(resperassign, "chechehc");
       
      if (resperassign.data.success) {
        await axios.put(
          `${apiUrl}/insights/employeeactivityupdate`,
          { empid: selectedEmployee, activityName: selectedActivity }
        );
        setSuccess(true);

        if (onSubmit) {
          onSubmit(assignmentData);
        }

        setTimeout(() => {
          setSelectedEmployee("");
          setSelectedEmployeeName("");
          setSelectedActivity("");
          setSuccess(false);
        }, 2000);
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Error assigning activity. Please try again."
      );
      console.error("Error assigning activity:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 mb-6 text-white shadow-lg">
          <h1 className="text-3xl font-bold text-center mb-2">Activity Assignment</h1>
          <p className="text-center opacity-90">Assign activities to employees</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
            <div className="text-gray-600 text-lg">Loading data...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
          <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 mb-6 text-white shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-2">Activity Assignment</h1>
        <p className="text-center opacity-90">Assign activities to employees</p>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-xl shadow-sm">
          <div className="flex items-center">
            <CheckSquare className="w-5 h-5 mr-2" />
            Activity assigned successfully!
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl shadow-sm">
          <div className="flex items-center">
            <X className="w-5 h-5 mr-2" />
            {error}
          </div>
        </div>
      )}

      {/* Assignment Form */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <div className="flex items-center mb-6">
          <UserCheck className="w-6 h-6 text-blue-600 mr-3" />
          <h2 className="text-2xl font-semibold text-gray-800">Activity Assignment</h2>
        </div>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  Select Employee *
                </div>
              </label>
              <div className="relative">
                <select
                  value={selectedEmployee}
                  onChange={(e) => {
                    setSelectedEmployee(e.target.value);
                    const selectedEmp = employees.find(
                      (emp) => emp.empid === e.target.value
                    );
                    setSelectedEmployeeName(selectedEmp ? selectedEmp.name : "");
                  }}
                  required
                  className="w-full min-w-[300px] px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                >
                  <option value="">Choose an employee...</option>
                  {employees.map((employee) => (
                    <option key={employee.empid} value={employee.empid}>
                      {employee.name} (ID: {employee.empid})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center">
                  <Target className="w-4 h-4 mr-1" />
                  Select Activity *
                </div>
              </label>
              <div className="relative">
                <select
                  value={selectedActivity}
                  onChange={(e) => setSelectedActivity(e.target.value)}
                  required
                  className="w-full min-w-[300px] px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                >
                  <option value="">Choose an activity...</option>
                  {activities.map((activity) => (
                    <option key={activity.name} value={activity.name}>
                      {activity.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Assignment Preview */}
          {(selectedEmployee && selectedActivity) && (
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-center">Assignment Preview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <p><strong>Employee:</strong> {selectedEmployeeName || "Not specified"}</p>
                  <p><strong>Employee ID:</strong> {selectedEmployee || "Not specified"}</p>
                </div>
                <div className="space-y-2">
                  <p><strong>Activity:</strong> {selectedActivity || "Not specified"}</p>
                </div>
              </div>
              
              <div className="mt-4 text-center p-4 bg-white bg-opacity-20 rounded-xl">
                <div className="text-lg font-bold">{selectedEmployeeName} ← {selectedActivity}</div>
                <div className="text-sm opacity-90">Activity Assignment</div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="button"
            disabled={submitting}
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 px-6 rounded-2xl hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg shadow-lg"
          >
            {submitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Assigning Activity...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <UserCheck className="w-5 h-5 mr-2" />
                Assign Activity
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const EmployeeRegistration = ({ onSubmit }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [position, setPosition] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      if (!name || !phone || !position) {
        setError("Please fill in all required fields");
        setLoading(false);
        return;
      }
      const employeeData = {
        name,
        phone,
        position,
      };

      const postRes = await axios.post(`${apiUrl}/insights/employeeadd`, {
        name,
        phone,
      });
      let id = postRes.data.empid;
      if (postRes.data) {
        const putRes = await axios.put(`${apiUrl}/user/updateusertype`, {
          phone_no: phone,
          user_type: position,
          emp_id: id,
        });
        setSuccess(true);
        if (onSubmit) {
          onSubmit(employeeData);
        }
        setTimeout(() => {
          setName("");
          setPhone("");
          setPosition("");
          setSuccess(false);
        }, 2000);
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Error registering employee. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneChange = async (e) => {
    const phone_no = e.target.value;
    setPhone(phone_no);
    if (phone_no.length >= 10) {
      try {
        const res = await axios.get(`${apiUrl}/user/getusername/${phone_no}`);
        setName(res.data.name);
      } catch (error) {
        setError("Error fetching name:");
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-green-50 to-emerald-100 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 mb-6 text-white shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-2">
          Employee Management
        </h1>
        <p className="text-center opacity-90">
          Register and manage your employees
        </p>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-xl shadow-sm">
          <div className="flex items-center">
            <CheckSquare className="w-5 h-5 mr-2" />
            Employee registered and updated successfully!
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl shadow-sm">
          <div className="flex items-center">
            <X className="w-5 h-5 mr-2" />
            {error}
          </div>
        </div>
      )}

      {/* Employee Form */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <div className="flex items-center mb-6">
          <User className="w-6 h-6 text-green-600 mr-3" />
          <h2 className="text-2xl font-semibold text-gray-800">
            Employee Registration
          </h2>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  Full Name *
                </div>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter full name"
                  required
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 bg-gray-50"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Auto-filled based on phone number
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-1" />
                  Phone Number *
                </div>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="Enter phone number"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center">
                  <Briefcase className="w-4 h-4 mr-1" />
                  Position *
                </div>
              </label>
              <div className="relative">
                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                >
                  <option value="">Select Employee Type...</option>
                  <option value="employee">Employee</option>
                  <option value="window_employee">Window Employee</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
          </div>

          {/* Employee Preview */}
          {(name || phone || position) && (
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-center">
                Employee Preview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="space-y-2">
                  <p>
                    <strong>Full Name:</strong> {name || "Not specified"}
                  </p>
                </div>
                <div className="space-y-2">
                  <p>
                    <strong>Phone:</strong> {phone || "Not specified"}
                  </p>
                </div>
                <div className="space-y-2">
                  <p>
                    <strong>Position:</strong> {position || "Not specified"}
                  </p>
                </div>
              </div>

              <div className="mt-4 text-center p-4 bg-white bg-opacity-20 rounded-xl">
                <div className="text-2xl font-bold">
                  {name || "Employee Name"}
                </div>
                <div className="text-sm opacity-90">
                  {position || "Position"} • {phone || "Phone Number"}
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="button"
            disabled={loading}
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-2xl hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg shadow-lg"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Registering Employee...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Plus className="w-5 h-5 mr-2" />
                Register Employee
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const TodaySalesEntry = ({ onSubmit }) => {
  const [cashAmount, setCashAmount] = useState("");
  const [onlineAmount, setOnlineAmount] = useState("");
  const [creditCardAmount, setCreditCardAmount] = useState("");
  const [totalTransactions, setTotalTransactions] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");
  const getTotalAmount = () => {
    const cash = parseFloat(cashAmount) || 0;
    const online = parseFloat(onlineAmount) || 0;
    const credit = parseFloat(creditCardAmount) || 0;
    return (cash + online + credit).toFixed(2);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      cashAmount,
      onlineAmount,
      creditCardAmount,
      totalAmount: getTotalAmount(),
      totalTransactions,
      date,
      notes,
    });
    // Reset form
    setCashAmount("");
    setOnlineAmount("");
    setCreditCardAmount("");
    setTotalTransactions("");
    setDate(new Date().toISOString().split("T")[0]);
    setNotes("");
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Today's Sales Entry
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date *
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cash Amount ($) *
            </label>
            <input
              type="number"
              value={cashAmount}
              onChange={(e) => setCashAmount(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Online Payment ($) *
            </label>
            <input
              type="number"
              value={onlineAmount}
              onChange={(e) => setOnlineAmount(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Credit Card ($) *
            </label>
            <input
              type="number"
              value={creditCardAmount}
              onChange={(e) => setCreditCardAmount(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
          <h3 className="text-xl font-bold text-green-800">
            Total Amount: ${getTotalAmount()}
          </h3>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Total Number of Transactions *
          </label>
          <input
            type="number"
            value={totalTransactions}
            onChange={(e) => setTotalTransactions(e.target.value)}
            required
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Notes
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any additional notes about today's sales..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition duration-200"
        >
          Submit Sales Entry
        </button>
      </div>
    </div>
  );
};

const ActivityCreate = ({ onSubmit }) => {
  const [name, setName] = useState("");
  const [coinRequired, setcoinRequired] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!name || !coinRequired) {
        setError("Please fill in all required fields");
        setLoading(false);
        return;
      }

      const ActivityData = {
        name,
        coinRequired,
      };

      console.log(ActivityData, "activity");

      const postRes = await axios.post(`${apiUrl}/activity/addactivity`, {
        name,
        coins_required: coinRequired,
      });

      if (postRes) {
        setSuccess(true);
        if (onSubmit) {
          onSubmit(ActivityData);
        }

        // Reset form after successful submission
        setTimeout(() => {
          setName("");
          setcoinRequired("");
          setSuccess(false);
        }, 2000);
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Error Adding Activity. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl p-6 mb-6 text-white shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-2">
          Activity Management
        </h1>
        <p className="text-center opacity-90">
          Create and manage your activities
        </p>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-xl shadow-sm">
          <div className="flex items-center">
            <CheckSquare className="w-5 h-5 mr-2" />
            Activity added successfully!
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl shadow-sm">
          <div className="flex items-center">
            <X className="w-5 h-5 mr-2" />
            {error}
          </div>
        </div>
      )}

      {/* Activity Form */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <div className="flex items-center mb-6">
          <Activity className="w-6 h-6 text-pink-600 mr-3" />
          <h2 className="text-2xl font-semibold text-gray-800">
            Activity Registration
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Activity Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter activity name"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Coins Required *
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={coinRequired}
                  onChange={(e) => setcoinRequired(e.target.value)}
                  placeholder="Enter coins required"
                  min="0"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition duration-200"
                />
              </div>
            </div>
          </div>

          {/* Activity Preview */}
          {(name || coinRequired) && (
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-center">
                Activity Preview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <p>
                    <strong>Activity Name:</strong> {name || "Not specified"}
                  </p>
                </div>
                <div className="space-y-2">
                  <p>
                    <strong>Coins Required:</strong> {coinRequired || "0"}
                  </p>
                </div>
              </div>

              <div className="mt-4 text-center p-4 bg-white bg-opacity-20 rounded-xl">
                <div className="text-2xl font-bold">
                  {name || "Activity Name"}
                </div>
                <div className="text-sm opacity-90">
                  {coinRequired || "0"} coins required
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-4 px-6 rounded-2xl hover:from-pink-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg shadow-lg"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Adding Activity...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Plus className="w-5 h-5 mr-2" />
                Add Activity
              </div>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

const PackageManagement = ({ onSubmit, packageData = [] }) => {
  const [packageName, setPackageName] = useState("");
  const [totalCost, setTotalCost] = useState("");
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [currentActivity, setCurrentActivity] = useState("");
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDays, setSelectedDays] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [fetchingActivities, setFetchingActivities] = useState(true);

  const daysOfWeek = [
    { value: "monday", label: "Mon", fullLabel: "Monday" },
    { value: "tuesday", label: "Tue", fullLabel: "Tuesday" },
    { value: "wednesday", label: "Wed", fullLabel: "Wednesday" },
    { value: "thursday", label: "Thu", fullLabel: "Thursday" },
    { value: "friday", label: "Fri", fullLabel: "Friday" },
    { value: "saturday", label: "Sat", fullLabel: "Saturday" },
    { value: "sunday", label: "Sun", fullLabel: "Sunday" },
  ];

  // Fetch activities from API
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setFetchingActivities(true);
        setError("");

        const activitiesResponse = await axios.get(
          `${apiUrl}/activity/activityfetch`
        );

        const activitiesData =
          activitiesResponse.data?.data || activitiesResponse.data || [];

        setActivities(activitiesData);
      } catch (err) {
        console.error("Error fetching activities:", err);
        setError("Failed to fetch activities. Please try again.");
      } finally {
        setFetchingActivities(false);
      }
    };

    if (apiUrl) {
      fetchActivities();
    } else {
      setFetchingActivities(false);
    }
  }, [apiUrl]);

  const handleAddActivity = () => {
    if (
      currentActivity &&
      !selectedActivities.find((item) => item.id === currentActivity._id)
    ) {
      setSelectedActivities([
        ...selectedActivities,
        {
          id: currentActivity._id,
          name: currentActivity.name,
          coins_required: currentActivity.coins_required,
          count: 1,
          isUnlimited: false,
        },
      ]);
      setCurrentActivity("");
    }
  };

  const handleSelectAllActivities = () => {
    const allActivities = activities.map((activity) => ({
      id: activity._id,
      name: activity.name,
      coins_required: activity.coins_required,
      count: 1,
      isUnlimited: false,
    }));
    setSelectedActivities(allActivities);
    setCurrentActivity("");
  };

  const handleCountChange = (activityId, increment) => {
    setSelectedActivities((prev) =>
      prev.map((activity) =>
        activity.id === activityId
          ? {
              ...activity,
              count: Math.max(1, activity.count + (increment ? 1 : -1)),
            }
          : activity
      )
    );
  };

  const handleUnlimitedChange = (activityId, isUnlimited) => {
    setSelectedActivities((prev) =>
      prev.map((activity) =>
        activity.id === activityId
          ? {
              ...activity,
              isUnlimited,
              count: isUnlimited ? 999 : 1,
            }
          : activity
      )
    );
  };

  const handleRemoveActivity = (activityId) => {
    setSelectedActivities((prev) =>
      prev.filter((activity) => activity.id !== activityId)
    );
  };

  const handleDayToggle = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSelectAllDays = () => {
    if (selectedDays.length === daysOfWeek.length) {
      setSelectedDays([]);
    } else {
      setSelectedDays(daysOfWeek.map((day) => day.value));
    }
  };

  const createPackagePayload = () => {
    return {
      packageName,
      totalCost: parseFloat(totalCost),
      activities: selectedActivities.map((activity) => ({
        activityId: activity.id,
        name: activity.name,
        coins_required: activity.coins_required,
        count: activity.count,
        isUnlimited: activity.isUnlimited,
      })),
      selectedDays,
      createdAt: new Date().toISOString(),
    };
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      if (!packageName || !totalCost) {
        setError("Please fill in all required fields");
        setLoading(false);
        return;
      }

      if (selectedActivities.length === 0) {
        setError("Please select at least one activity");
        setLoading(false);
        return;
      }

      if (selectedDays.length === 0) {
        setError("Please select at least one day");
        setLoading(false);
        return;
      }

      const packagePayload = createPackagePayload();
      console.log("Package Payload:", packagePayload);

      // You can send this payload to your API here
      const response = await axios.post(`${apiUrl}/unlimitedPackage/package`, packagePayload);
      if (response.data) {
          toast.success("Package created successfully!");
      }

      setSuccess(true);
      if (onSubmit) {
        onSubmit(packagePayload);
      }

      // Reset form after successful submission
      setTimeout(() => {
        setPackageName("");
        setTotalCost("");
        setSelectedActivities([]);
        setSelectedDays([]);
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError("Error creating package. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getTotalAmount = () => {
    return parseFloat(totalCost) || 0;
  };

  if (fetchingActivities) {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading activities...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 mb-6 text-white shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-2">
          Enhanced Package Management
        </h1>
        <p className="text-center opacity-90">
          Create and customize your activity packages
        </p>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-xl shadow-sm">
          <div className="flex items-center">
            <CheckSquare className="w-5 h-5 mr-2" />
            Package created successfully!
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl shadow-sm">
          <div className="flex items-center">
            <X className="w-5 h-5 mr-2" />
            {error}
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Basic Package Information */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="flex items-center mb-4">
            <Package className="w-6 h-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">
              Package Information
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Package Name *
              </label>
              <input
                type="text"
                value={packageName}
                onChange={(e) => setPackageName(e.target.value)}
                placeholder="Enter package name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Cost (₹) *
              </label>
              <div className="relative">
               
                <input
                  type="number"
                  value={totalCost}
                  onChange={(e) => setTotalCost(e.target.value)}
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Add Activity Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-200">
          <div className="flex items-center mb-4">
            <Activity className="w-6 h-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-blue-800">
              Add Activities
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Activity
              </label>
              <select
                value={currentActivity}
                onChange={(e) => {
                  if (e.target.value === "select_all") {
                    handleSelectAllActivities();
                  } else {
                    const activity = e.target.value
                      ? JSON.parse(e.target.value)
                      : "";
                    setCurrentActivity(activity);
                  }
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              >
                <option value="">Choose an activity...</option>
                <option value="select_all">🔲 Select All Activities</option>
                {activities.map((activity) => (
                  <option key={activity._id} value={JSON.stringify(activity)}>
                    {activity.name} (Coins: {activity.coins_required})
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <button
                onClick={
                  currentActivity === "select_all"
                    ? handleSelectAllActivities
                    : handleAddActivity
                }
                disabled={!currentActivity}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Activity
              </button>
            </div>
          </div>
        </div>

        {/* Selected Activities */}
        {selectedActivities.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <CheckSquare className="w-6 h-6 text-green-600 mr-2" />
                <h2 className="text-xl font-semibold text-green-800">
                  Selected Activities ({selectedActivities.length})
                </h2>
              </div>
            </div>

            <div className="space-y-4">
              {selectedActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition duration-200"
                >
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                    {/* Activity Info */}
                    <div className="md:col-span-2">
                      <h3 className="font-semibold text-gray-800">
                        {activity.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Coins: {activity.coins_required}
                      </p>
                    </div>

                    {/* Unlimited Checkbox */}
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`unlimited-${activity.id}`}
                        checked={activity.isUnlimited}
                        onChange={(e) =>
                          handleUnlimitedChange(activity.id, e.target.checked)
                        }
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label
                        htmlFor={`unlimited-${activity.id}`}
                        className="ml-2 text-sm text-gray-700"
                      >
                        Unlimited
                      </label>
                    </div>

                    {/* Count Controls */}
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => handleCountChange(activity.id, false)}
                        disabled={activity.count <= 1 || activity.isUnlimited}
                        className="w-8 h-8 bg-red-100 text-red-600 rounded-full hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition duration-200"
                      >
                        <Minus className="w-4 h-4" />
                      </button>

                      <span className="w-16 text-center font-semibold text-lg">
                        {activity.isUnlimited ? "∞" : activity.count}
                      </span>

                      <button
                        onClick={() => handleCountChange(activity.id, true)}
                        disabled={activity.isUnlimited}
                        className="w-8 h-8 bg-green-100 text-green-600 rounded-full hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition duration-200"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Delete Button */}
                    <div className="flex justify-center">
                      <button
                        onClick={() => handleRemoveActivity(activity.id)}
                        className="w-8 h-8 bg-red-100 text-red-600 rounded-full hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center justify-center transition duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Day Selection */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Calendar className="w-6 h-6 text-orange-600 mr-2" />
              <h2 className="text-xl font-semibold text-orange-800">
                Available Days
              </h2>
            </div>
            <button
              onClick={handleSelectAllDays}
              className="text-sm text-orange-600 hover:text-orange-800 font-medium px-3 py-1 rounded-lg hover:bg-orange-50 transition duration-200"
            >
              {selectedDays.length === daysOfWeek.length
                ? "Deselect All"
                : "Select All"}
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-7 gap-3">
            {daysOfWeek.map((day) => (
              <button
                key={day.value}
                onClick={() => handleDayToggle(day.value)}
                className={`p-4 rounded-xl text-center font-medium transition-all duration-200 ${
                  selectedDays.includes(day.value)
                    ? "bg-orange-500 text-white shadow-lg transform scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md"
                }`}
              >
                <div className="text-sm md:text-base">{day.label}</div>
                <div className="text-xs opacity-75 md:hidden">
                  {day.fullLabel}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Package Summary */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
          <h3 className="text-2xl font-bold mb-4 text-center">
            Package Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-2">
              <p>
                <strong>Package Name:</strong> {packageName || "Not specified"}
              </p>
              <p>
                <strong>Total Cost:</strong> ₹{getTotalAmount().toFixed(2)}
              </p>
              <p>
                <strong>Activities:</strong> {selectedActivities.length}{" "}
                selected
              </p>
            </div>
            <div className="space-y-2">
              <p>
                <strong>Available Days:</strong>{" "}
                {selectedDays.length > 0
                  ? selectedDays
                      .map(
                        (day) => daysOfWeek.find((d) => d.value === day)?.label
                      )
                      .join(", ")
                  : "None selected"}
              </p>
            </div>
          </div>

          <div className="mt-6 text-center p-4 bg-white bg-opacity-20 rounded-xl">
            <div className="text-3xl font-bold">
              ₹{getTotalAmount().toFixed(2)}
            </div>
            <div className="text-sm opacity-90">
              {selectedActivities.length} activities • {selectedDays.length}{" "}
              days
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-2xl hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg shadow-lg"
        >
          {loading
            ? "Creating Package..."
            : `Submit Package (₹${getTotalAmount().toFixed(2)})`}
        </button>
      </div>
    </div>
  );
};

const EmployeeManagementForms = () => {
  const [activeForm, setActiveForm] = useState(1);

  const handleFormSubmit = async (data) => {
    try {
      let endpoint = "";

      switch (activeForm) {
        case 1:
          endpoint = "/employee/assign-activity";
          break;
        case 2:
          endpoint = "/employee/register";
          break;
        case 3:
          endpoint = "/sales/daily-entry";
          break;
        default:
          throw new Error("Invalid form selection");
      }

      // Simulating API call
      console.log(`Submitting to ${endpoint}:`, data);

      // Replace with actual API call
      // const response = await axios.post(`${apiUrl}${endpoint}`, data);

      console.log("Data submitted successfully:", data);
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const renderForm = () => {
    switch (activeForm) {
      case 1:
        return <ActivityAssignment onSubmit={handleFormSubmit} />;
      case 2:
        return <EmployeeRegistration onSubmit={handleFormSubmit} />;
      case 3:
        return <TodaySalesEntry onSubmit={handleFormSubmit} />;
      case 4:
        return <ActivityCreate onSubmit={handleFormSubmit} />;
      case 5:
        return <PackageManagement onSubmit={handleFormSubmit} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 ">
      <div className="max-w-4xl mx-auto px-4 p-10 m-10">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Management System
        </h1>

        <div className="flex justify-center gap-4 mb-8 flex-wrap">
          <button
            onClick={() => setActiveForm(1)}
            className={`px-6 py-3 rounded-lg font-medium transition duration-200 ${
              activeForm === 1
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50"
            }`}
          >
            Activity Assignment
          </button>
          <button
            onClick={() => setActiveForm(2)}
            className={`px-6 py-3 rounded-lg font-medium transition duration-200 ${
              activeForm === 2
                ? "bg-green-600 text-white shadow-lg"
                : "bg-white text-green-600 border-2 border-green-600 hover:bg-green-50"
            }`}
          >
            Employee Registration
          </button>
          <button
            onClick={() => setActiveForm(3)}
            className={`px-6 py-3 rounded-lg font-medium transition duration-200 ${
              activeForm === 3
                ? "bg-purple-600 text-white shadow-lg"
                : "bg-white text-purple-600 border-2 border-purple-600 hover:bg-purple-50"
            }`}
          >
            Sales Entry
          </button>

          <button
            onClick={() => setActiveForm(4)}
            className={`px-6 py-3 rounded-lg font-medium transition duration-200 ${
              activeForm === 4
                ? "bg-pink-600 text-white shadow-lg"
                : "bg-white text-pink-600 border-2 border-pink-600 hover:bg-purple-50"
            }`}
          >
            Activity Entry
          </button>
          <button
            onClick={() => setActiveForm(5)}
            className={`px-6 py-3 rounded-lg font-medium transition duration-200 ${
              activeForm === 5
                ? "bg-pink-600 text-white shadow-lg"
                : "bg-white text-pink-600 border-2 border-pink-600 hover:bg-purple-50"
            }`}
          >
            Unlimited Package Management
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-1">{renderForm()}</div>
      </div>
    </div>
  );
};

export default EmployeeManagementForms;
