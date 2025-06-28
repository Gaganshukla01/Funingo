import Sales from "../models/sales.js";
import ActivitiesSales from "../models/activitydashboard.js";
import CustomerInsight from "../models/customerinsight.js";
import EmployeeModel from "../models/employee.js";

export const salesFetch = async (req, res) => {
  try {
    const sales = await Sales.find();
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const salesLastId = async (req, res) => {
  try {
    const sales = await Sales.find();
    let nextId = 1;
    const l = sales.length;
    if (sales.length > 0) {
      const lastId = Number(sales[l - 1].id) || 0;
      nextId = lastId + 1;
    }
    console.log(nextId);
    res.json({
      nextId: nextId,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const salesAdd = async (req, res) => {
  const sales = new Sales(req.body);
  try {
    const savedSales = await sales.save();
    res.status(201).json(savedSales);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const activitiesFetch = async (req, res) => {
  try {
    const activities = await ActivitiesSales.find();
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const activityPersonAssign = async (req, res) => {
  try {
    const { activityName, assignedPersonName } = req.body;

    if (!activityName || !assignedPersonName) {
      return res.status(400).json({
        success: false,
        message: "Activity name and assigned person name are required",
      });
    }

    const currentDate = new Date()
      .toISOString()
      .split("T")[0]
      .replace(/-/g, "/");
    const existingActivity = await ActivitiesSales.findOne({
      name: activityName,
      date: currentDate,
    });

    if (existingActivity) {
      if (!existingActivity.assignedPeople.includes(assignedPersonName)) {
        existingActivity.assignedPeople.push(assignedPersonName);
        await existingActivity.save();

        return res.json({
          success: true,
          message: "Person assigned to existing activity",
          activity: existingActivity,
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "Person is already assigned to this activity for today",
        });
      }
    } else {
      const activities = await ActivitiesSales.find().select("_id");
      let lastIdNumber = 0;
      if (activities.length > 0) {
        lastIdNumber = Math.max(
          ...activities.map((activity) => parseInt(activity._id, 10))
        );
      }
      let nextId = (lastIdNumber + 1).toString();

      const newActivity = new ActivitiesSales({
        _id: nextId,
        name: activityName,
        redemptions: 0,
        date: currentDate,
        assignedPeople: [assignedPersonName],
      });

      await newActivity.save();

      return res.json({
        success: true,
        message: "New activity created and person assigned",
        activity: newActivity,
      });
    }
  } catch (error) {
    console.error("Error assigning activity:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: error.message,
    });
  }
};

export const activityAdd = async (req, res) => {
  const { name, date, assignedPeople } = req.body;

  try {
    const existingActivity = await ActivitiesSales.findOne({ name, date });
    if (existingActivity) {
      existingActivity.redemptions += 1;
      if (assignedPeople && Array.isArray(assignedPeople)) {
        assignedPeople.forEach((person) => {
          if (!existingActivity.assignedPeople.includes(person)) {
            existingActivity.assignedPeople.push(person);
          }
        });
      } else if (assignedPeople && typeof assignedPeople === "string") {
        if (!existingActivity.assignedPeople.includes(assignedPeople)) {
          existingActivity.assignedPeople.push(assignedPeople);
        }
      }
      const updatedActivity = await existingActivity.save();
      res.status(200).json(updatedActivity);
    } else {
      const activities = await ActivitiesSales.find().select("_id");
      let lastIdNumber = 0;
      if (activities.length > 0) {
        lastIdNumber = Math.max(
          ...activities.map((activity) => parseInt(activity._id, 10))
        );
      }
      let nextId = (lastIdNumber + 1).toString();

      let peopleArray = [];
      if (assignedPeople) {
        if (Array.isArray(assignedPeople)) {
          peopleArray = assignedPeople;
        } else if (typeof assignedPeople === "string") {
          peopleArray = [assignedPeople];
        }
      }

      const newActivity = new ActivitiesSales({
        _id: nextId,
        name,
        date,
        redemptions: 1,
        assignedPeople: peopleArray,
        
      });

      const savedActivity = await newActivity.save();
      res.status(201).json(savedActivity);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const customerinsightFetch = async (req, res) => {
  try {
    const insights = await CustomerInsight.find();
    res.json(insights);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const customerinsightAdd = async (req, res) => {
  const insights = new CustomerInsight(req.body);
  try {
    const savedInsights = await insights.save();
    res.status(201).json(savedInsights);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const employeeAdd = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const existingEmployee = await EmployeeModel.findOne({ phone });
    if (existingEmployee) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }
    const lastEmployee = await EmployeeModel.findOne()
      .sort({ empid: -1 })
      .limit(1);

    let nextEmpid;

    if (lastEmployee && lastEmployee.empid) {
      const numericPart = parseInt(lastEmployee.empid.replace("E", ""));

      nextEmpid = `E${numericPart + 1}`;
    } else {
      nextEmpid = "E1";
    }
    const newEmployeeData = {
      empid: nextEmpid,
      name,
      phone,
      activities: [],
    };

    const newEmployee = new EmployeeModel(newEmployeeData);

    await newEmployee.save();

    res.json(newEmployee);
  } catch (error) {
    console.error("Error adding new employee:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const employeeFetch = async (req, res) => {
  try {
    const employee = await EmployeeModel.find();
    res.json(employee);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const employeeActivityUpdate = async (req, res) => {
  try {
    const { empid, activityName,count } = req.body;

    if (!empid || !activityName) {
      return res.status(400).json({
        success: false,
        message: "Employee ID and activity name are required",
      });
    }

    const currentDate = new Date().toISOString().split("T")[0];
    const employee = await EmployeeModel.findOne({ empid });
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    const existingActivityIndex = employee.activities.findIndex(
      (activity) =>
        activity.name === activityName && activity.date === currentDate
    );

    if (existingActivityIndex !== -1) {
      employee.activities[existingActivityIndex].count += 1;
    } else {
      employee.activities.push({
        name: activityName,
        count: count||0,
        date: currentDate,
      });
    }
    await employee.save();

    res.json({
      success: true,
      message: "Activity updated successfully",
      employee: employee,
    });
  } catch (error) {
    console.error("Error updating employee activity:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};
