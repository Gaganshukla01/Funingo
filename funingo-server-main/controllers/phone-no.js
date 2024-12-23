import PhoneNumber from '../models/phone-no.js';

export const getAllPhoneNo = async (req, res) => {
  const phoneNos = await PhoneNumber.find();
  res.status(200).send({
    success: true,
    phone_numbers: phoneNos
  });
};

export const deletePhoneNumber = async (req, res) => {
  const { id } = req.params;
  await PhoneNumber.findByIdAndDelete(id);
  res.status(200).send({
    success: true
  });
};

export const addPhoneNumber = async (req, res) => {
  const { name, number } = req.body;
  const newPhoneNumber = new PhoneNumber({ name, number });
  await newPhoneNumber.save();

  res.status(200).send({
    success: true
  });
};
