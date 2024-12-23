import cloudinary from '../cloudinary/index.js';
import Image from '../models/images.js';

export const uploadImage = async (req, res) => {
  const images = req.files.map(file => ({
    url: file.path,
    filename: file.filename
  }));
  res.status(200).send({
    success: true,
    images
  });
};

export const addImages = async (req, res) => {
  const { images } = req.body;
  await Image.insertMany(images);
  res.status(200).send({
    success: true
  });
};

export const fetchImages = async (req, res) => {
  const images = await Image.find();
  res.status(200).send({
    success: true,
    images
  });
};

export const deleteImage = async (req, res) => {
  const { id } = req.params;
  const image = await Image.findById(id);
  if (image.filename) {
    await cloudinary.cloudinary.uploader.destroy(image.filename);
  }
  await image.deleteOne();

  res.status(200).send({
    success: true
  });
};
