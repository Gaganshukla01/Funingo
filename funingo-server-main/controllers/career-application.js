import cloudinary from '../cloudinary/index.js';
import CareerApplication from '../models/career-application.js';

export const addApplication = async (req, res) => {
  const newApplication = new CareerApplication({
    ...req.body,
    resume_url: req.file.path,
    resume_filename: req.file.filename
  });
  await newApplication.save();

  res.status(200).send({
    success: true
  });
};

export const fetchAllApplications = async (req, res) => {
  const applications = await CareerApplication.find();
  res.status(200).send({
    success: true,
    applications
  });
};

export const deleteApplication = async (req, res) => {
  const { id } = req.params;
  const application = await CareerApplication.findById(id);
  if (application.resume_filename) {
    await cloudinary.cloudinary.uploader.destroy(application.resume_filename);
  }
  await application.deleteOne();

  res.status(200).send({
    success: true
  });
};
