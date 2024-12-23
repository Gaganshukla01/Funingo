import Franchise from '../models/franchise.js';

export const addNewFranchise = async (req, res) => {
  const data = req.body;
  const newFranchise = new Franchise(data);
  await newFranchise.save();
  res.status(200).send({
    success: true
  });
};

export const deleteFranchise = async (req, res) => {
  const { id } = req.params;
  await Franchise.findByIdAndDelete(id);
  res.status(200).send({
    success: true
  });
};

export const getAllFranchise = async (req, res) => {
  const franchises = await Franchise.find();
  res.status(200).send({
    success: true,
    franchises: franchises
  });
};
