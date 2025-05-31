import Sales from "../models/sales.js"
import ActivitiesSales from "../models/activitydashboard.js"
import CustomerInsight from "../models/customerinsight.js"
import EmployeeModel from "../models/employee.js"


export const salesFetch= async(req,res)=>{
    try {
    const sales = await Sales.find();
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

}

export const salesLastId =async(req,res)=>{
   try {
    const sales = await Sales.find(); 
    console.log(sales)
    let nextId = 1;
    const l=sales.length
    if (sales.length > 0) {
      const lastId = Number(sales[l-1].id)||0;
      nextId = lastId + 1;
    }
    console.log(nextId)
    res.json({
      nextId: nextId
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const salesAdd=async(req,res)=>{
      const sales = new Sales(req.body);
  try {
    const savedSales = await sales.save();
    res.status(201).json(savedSales);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export const activitiesFetch=async(req,res)=>{
      try {
    const activities = await ActivitiesSales.find();
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

}

export const activityAdd = async (req, res) => {
  const { name, date, assignedPeople } = req.body;
  
  try {
    const existingActivity = await ActivitiesSales.findOne({ name, date });
    if (existingActivity) {
      existingActivity.redemptions += 1;
      if (assignedPeople && Array.isArray(assignedPeople)) {
        assignedPeople.forEach(person => {
          if (!existingActivity.assignedPeople.includes(person)) {
            existingActivity.assignedPeople.push(person);
          }
        });
      } else if (assignedPeople && typeof assignedPeople === 'string') {
        if (!existingActivity.assignedPeople.includes(assignedPeople)) {
          existingActivity.assignedPeople.push(assignedPeople);
        }
      }
      const updatedActivity = await existingActivity.save();
      res.status(200).json(updatedActivity);
    } else {
      
      const lastActivity = await ActivitiesSales.findOne()
        .sort({ _id: -1 })
        .select('_id');
      
      let nextId = '1';
      if (lastActivity && lastActivity._id) {
        const lastIdNumber = parseInt(lastActivity._id);
        nextId = (lastIdNumber + 1).toString();
      }
      
      let peopleArray = [];
      if (assignedPeople) {
        if (Array.isArray(assignedPeople)) {
          peopleArray = assignedPeople;
        } else if (typeof assignedPeople === 'string') {
          peopleArray = [assignedPeople];
        }
      }
      
      const newActivity = new ActivitiesSales({
        _id: nextId,
        name,
        date,
        redemptions: 1,
        assignedPeople: peopleArray
      });
      
      const savedActivity = await newActivity.save();
      res.status(201).json(savedActivity);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const customerinsightFetch=async(req,res)=>{
    try {
    const insights = await CustomerInsight.find();
    res.json(insights);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const customerinsightAdd=async(req,res)=>{
  const insights = new CustomerInsight(req.body);
  try {
    const savedInsights = await insights.save();
    res.status(201).json(savedInsights);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}


export const employeeAdd = async (req, res) => {
  try {
    const { empid, name, date, activity } = req.body;
    console.log({ empid, name, activity, date });

    if (!name || !activity || !empid || !date) {
      return res.status(400).json({ error: 'Employee ID, name, activity, and date are required' });
    }

    
    const inputDate = new Date(date).toISOString().split('T')[0];

    let employee = await EmployeeModel.findOne({ empid });

    if (!employee) {
      // Create new employee and add activity with date
      employee = new EmployeeModel({
        empid,
        name,
        activities: [{ name: activity, count: 1, date: inputDate }],
      });
    } else {
      // Look for activity with same name and date
      const activityIndex = employee.activities.findIndex(
        (a) => a.name === activity && a.date === inputDate
      );

      if (activityIndex !== -1) {
        // Increment count if found
        employee.activities[activityIndex].count += 1;
      } else {
        // Add new activity for that date
        employee.activities.push({ name: activity, count: 1, date: inputDate });
      }
    }

    await employee.save();
    res.json(employee);
  } catch (error) {
    console.error('Error adding activity:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};





export const employeeFetch=async (req, res) => {
  try {
    const employee = await EmployeeModel.find();
    res.json(employee);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};