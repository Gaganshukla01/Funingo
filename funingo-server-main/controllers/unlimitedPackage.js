
import UnlimtedPackage from "../models/unlimitedPackage.js";

// Create/Save Package
export const PackageCreate = async (req, res) => {
  try {
    const packageData = new UnlimtedPackage(req.body);
    await packageData.save();
    res.status(201).json({ 
      success: true, 
      message: "Package created successfully",
      data: packageData 
    });
  } catch (error) {
    console.error('Error creating package:', error);
    res.status(400).json({ error: error.message });
  }
};

// Get All Packages
export const PackageFetch = async (req, res) => {
  try {
    console.log("he")
    const packages = await UnlimtedPackage.find({});
    if (!packages.length) {
      return res.status(404).json({ message: 'No packages found' });
    }
    res.status(200).json({ 
      success: true, 
      data: packages,
      count: packages.length 
    });
  } catch (error) {
    console.error('Error fetching packages:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get Single Package by ID
export const PackageGetById = async (req, res) => {
  try {
    const { id } = req.params;
    const packagev = await UnlimtedPackage.findById(id).lean();
    
    if (!packagev) {
      return res.status(404).json({ message: 'Package not found' });
    }
    
    res.status(200).json({ 
      success: true, 
      data: packagev 
    });
  } catch (error) {
    console.error('Error fetching package by ID:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update Package
export const PackageUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Add updatedAt timestamp
    updateData.updatedAt = new Date();
    
    const updatedPackage = await UnlimtedPackage.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedPackage) {
      return res.status(404).json({ message: 'Package not found' });
    }
    
    res.status(200).json({ 
      success: true, 
      message: "Package updated successfully",
      data: updatedPackage 
    });
  } catch (error) {
    console.error('Error updating package:', error);
    res.status(400).json({ error: error.message });
  }
};

// Delete Package (Soft Delete)
export const PackageDelete = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedPackage = await UnlimtedPackage.findByIdAndUpdate(
      id,
      { 
        isActive: false,
        updatedAt: new Date()
      },
      { new: true }
    );
    
    if (!deletedPackage) {
      return res.status(404).json({ message: 'Package not found' });
    }
    
    res.status(200).json({ 
      success: true, 
      message: "Package deleted successfully",
      data: deletedPackage 
    });
  } catch (error) {
    console.error('Error deleting package:', error);
    res.status(500).json({ error: error.message });
  }
};

// Hard Delete Package (Permanently remove from database)
export const PackageHardDelete = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedPackage = await UnlimtedPackage.findByIdAndDelete(id);
    
    if (!deletedPackage) {
      return res.status(404).json({ message: 'Package not found' });
    }
    
    res.status(200).json({ 
      success: true, 
      message: "Package permanently deleted"
    });
  } catch (error) {
    console.error('Error permanently deleting package:', error);
    res.status(500).json({ error: error.message });
  }
};

// Search Packages with Filters
export const PackageSearch = async (req, res) => {
  try {
    const {
      packageName,
      minCost,
      maxCost,
      days,
      packageType,
      page = 1,
      limit = 20
    } = req.query;

    let query = { isActive: true };

    // Package name search
    if (packageName) {
      query.packageName = new RegExp(packageName, 'i');
    }

    // Cost range filter
    if (minCost !== undefined || maxCost !== undefined) {
      query.totalCost = {};
      if (minCost !== undefined) query.totalCost.$gte = parseFloat(minCost);
      if (maxCost !== undefined) query.totalCost.$lte = parseFloat(maxCost);
    }

    // Days filter
    if (days) {
      const daysArray = Array.isArray(days) ? days : days.split(',');
      query.selectedDays = { $in: daysArray };
    }

    // Package type filter
    if (packageType) {
      query.packageType = packageType;
    }

    const skip = (page - 1) * limit;
    
    const packages = await UnlimtedPackage.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await UnlimtedPackage.countDocuments(query);

    res.status(200).json({
      success: true,
      data: packages,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        count: packages.length,
        totalRecords: total
      }
    });
  } catch (error) {
    console.error('Error searching packages:', error);
    res.status(500).json({ error: error.message });
  }
};







