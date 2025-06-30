import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  activityId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  coins_required: {
    type: Number,
    required: true,
    default: 0
  },
  count: {
    type: Number,
    required: true,
    default: 1
  },
  isUnlimited: {
    type: Boolean,
    required: true,
    default: false
  }
});

const unlimitedPackageSchema = new mongoose.Schema({
  packageName: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  totalCost: {
    type: Number,
    required: true,
    min: 0
  },
  activities: [activitySchema],
  selectedDays: [{
    type: String,
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    required: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const UnlimtedPackage = mongoose.model("UnlimtedPackage", unlimitedPackageSchema);

export default UnlimtedPackage;