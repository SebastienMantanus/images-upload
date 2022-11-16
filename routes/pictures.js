require("dotenv").config();
const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middlewares/isAuthenticated");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;

const convertToBase64 = (file) => {
  return `data:${file.mimetype};base64,${file.data.toString("base64")}`;
};

// cloudinary connexion
cloudinary.config({
  cloud_name: process.env.COUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Route upload image
router.post(
  "/picture/upload",
  isAuthenticated,
  fileUpload(),
  async (req, res) => {
    try {
      const imageToUpload = convertToBase64(req.files.image);

      const ticket = await cloudinary.uploader.upload(imageToUpload);
      console.log(ticket);
      res
        .status(201)
        .json(`${req.user.name} a bien uploadé l'image ${ticket.url}`);
    } catch (error) {
      console.log(error.message);
    }
  }
);

module.exports = router;
