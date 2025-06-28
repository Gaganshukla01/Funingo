import React, { useState, useEffect } from "react";
import { apiUrl } from "../../../constants";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import { ToastContainer, toast } from "react-toastify";


const ActivityAssignment = ({ onSubmit }) => {
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedEmployeeName, setSelectedEmployeeName] = useState("");
  const [selectedActivity, setSelectedActivity] = useState("");

  const [activities, setActivities] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

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
        toast.error("Error fetching data. Please try again.");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  console.log(employees, "emp");
  console.log(activities, "act");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!selectedEmployee || !selectedActivity) {
        toast.warning("Please fill in all required fields");
        return;
      }

      const assignmentData = {
        employeeId: selectedEmployee,
        activityId: selectedActivity,
      };
      const resperassign= await axios.post(`${apiUrl}/insights/activityassignpeople`, {activityName:selectedActivity,assignedPersonName:selectedEmployeeName,count:0});
       console.log(resperassign,"chechehc")
       
      if (resperassign.data.success) {
         await axios.put(
        `${apiUrl}/insights/employeeactivityupdate`,
        { empid: selectedEmployee, activityName: selectedActivity }
      );
        toast.success("Activity assigned successfully!");

        if (onSubmit) {
          onSubmit(assignmentData);
        }

        setSelectedEmployee("");
        setSelectedActivity("");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Error assigning activity. Please try again."
      );
      console.error("Error assigning activity:", error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-center items-center h-32">
          <div className="text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Activity Assignment
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Employee *
          </label>
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Choose an employee...</option>
            {employees.map((employee) => (
              <option key={employee.empid} value={employee.empid}>
                {employee.name} (ID: {employee.empid})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Activity *
          </label>
          <select
            value={selectedActivity}
            onChange={(e) => setSelectedActivity(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Choose an activity...</option>
            {activities.map((activity) => (
              <option key={activity.name} value={activity.name}>
                {activity.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
        >
          Assign Activity
        </button>
      </form>
    </div>
  );
};

const EmployeeRegistration = ({ onSubmit }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [position, setPosition] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!name || !phone || !position) {
        toast.warning("Please fill in all required fields");
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
        toast.success("Employee registered and updated successfully!");
        if (onSubmit) {
          onSubmit(employeeData);
        }
        setName("");
        setPhone("");
        setPosition("");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Error registering employee. Please try again."
      );
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
        toast.error("Error fetching name:");
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Employee Registration
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              value={phone}
              onChange={handlePhoneChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Position *
            </label>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Select Employee Type...</option>
              <option value="employee">Employee</option>
              <option value="window_employee">Window Employee</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200"
        >
          Register Employee
        </button>
      </form>
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

const ActivityAssign = ({ onSubmit }) => {
  const [name, setName] = useState("");
  const [coinRequired, setcoinRequired] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!name || !coinRequired) {
        toast.warning("Please fill in all required fields");
        return;
      }
      const ActivityData = {
        name,
        coinRequired,
      };

      console.log(ActivityData, "acctivity");

      const postRes = await axios.post(`${apiUrl}/activity/addactivity`, {
        name,
        coins_required: coinRequired,
      });
      if (postRes) {
        toast.success("Activity Added successfully!");
        if (onSubmit) {
          onSubmit(ActivityData);
        }
        setName("");
        setcoinRequired("");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Error Adding Activity. Please try again."
      );
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Activity Registration
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Activity Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Coin Required *
            </label>
            <input
              type="tel"
              value={coinRequired}
              onChange={(e) => setcoinRequired(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition duration-200"
        >
          Add Activity
        </button>
      </form>
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
        return <ActivityAssign onSubmit={handleFormSubmit} />;
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
        </div>

        <div className="bg-white rounded-xl shadow-lg p-1">{renderForm()}</div>
      </div>
    </div>
  );
};

export default EmployeeManagementForms;
