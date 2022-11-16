require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const uid2 = require("uid2");
const sha256 = require("crypto-js/sha256");
const Base64 = require("crypto-js/enc-base64");

mongoose.connect(MONGODB_URI);
const User = require("./models/User");

const app = express();
app.use(express.json());

const isAuthenticated = require("./middlewares/isAuthenticated");

// Routes du compte
app.post("/user/new", async (req, res) => {
  try {
    // check existing user
    const UserToSearch = await User.findOne({ email: req.body.email });

    if (!UserToSearch) {
      // password generation
      const password = req.body.password;
      const salt = uid2(16);
      const hash = sha256(password + salt).toString(Base64);
      const token = uid2(16);
      // user creation
      const userToAdd = new User({
        email: req.body.email,
        name: req.body.name,
        hash: hash,
        token: token,
      });

      await userToAdd.save();
      res.status(201).json(`L'utilisateur : ${userToAdd.name} est bien créé !`);
    } else {
      res
        .status(201)
        .json(`L'utilisateur ${req.body.name} est déjà enregistré !`);
    }
  } catch (error) {
    console.log(error.message);
  }
});

// routes d'images
const picturesRoutes = require("./routes/pictures");
app.use(picturesRoutes);

// catch All
app.all("*", (req, res) => {
  try {
    return res
      .status(404)
      .json("Tous ceux qui errent ne sont pas forcément perdus");
  } catch (error) {
    console.log(error.message);
  }
});

app.listen(process.env.PORT, () => {
  console.log("Server Online : let the show begin baby !");
});
