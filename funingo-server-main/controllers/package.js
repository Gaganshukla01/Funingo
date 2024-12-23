import Package from "../models/package.js";

export const getAllPackages = async (req, res) => {
  const packages = await Package.find();
  res.status(200).send({
    success: true,
    packages,
  });
};

export const deletePackage = async (req, res) => {
  const { id } = req.params;
  await Package.findByIdAndDelete(id);
  res.status(200).send({
    success: true,
  });
};

export const addPackage = async (req, res) => {
  const { name, coins, price } = req.body;
  const newPackage = new Package({
    name,
    coins,
    price,
  });
  await newPackage.save();

  res.status(200).send({
    success: true,
  });
};
