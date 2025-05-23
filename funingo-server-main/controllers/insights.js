import Sales from "../models/sales.js"
import ActivitiesSales from "../models/activitydashboard.js"
import CustomerInsight from "../models/customerinsight.js"


export const salesFetch= async(req,res)=>{
    try {
    const sales = await Sales.find();
    res.json(sales);
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

export const activityAdd=async(req,res)=>{
     const activity = new ActivitiesSales(req.body);
  try {
    const savedActivity = await activity.save();
    res.status(201).json(savedActivity);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

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