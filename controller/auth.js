const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcrypt");
const expressjwt = require("express-jwt");
const User = require("../models/user");

const _ = require("lodash");
const dotenv = require("dotenv");
dotenv.config();

exports.signup = async (req, res) => {
  try {
    const userexists = await User.findOne({ email: req.body.email });
    if (userexists)
      return res.status(403).json({
        error: "Email is already taken signup with different email",
      });

    const hashed_password = await bcrypt.hash(req.body.password, 10);

    const user = await new User({ ...req.body, hashed_password });
    if (req.body.password !== req.body.cpassword)
      return res
        .status(403)
        .json({ error: "password and confirm password is not mached" });
    await user.save();
    res.status(200).json({ message: "signup successful! please login." });
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.signin = async (req, res) => {
  try {
    console.log("sigin");
    const { email, password } = req.body;
    User.findOne({ email }, async (err, user) => {
      //console.log(user);
      if (err || !user) {
        return res.status(401).json({
          error: "User with this email is doesn't exist . please sign-UP",
        });
      }
      // if user is found then email and password must match
      // create authenticate method in model and use here
      const isValidPasword = await bcrypt.compare(
        password,
        user.hashed_password
      );
      console.log("is valid", isValidPasword);
      if (!isValidPasword) {
        return res.status(401).json({
          error: "email and password are not matching",
        });
      }
      //generate a token with user id and secret

      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

      res.cookie("jwt", token, {
        expires: new Date(Date.now() + 18000),
        httpOnly: true,
      });
      //return response with user and give to front end client
      const { _id, name, email } = user;
      return res.json({ token, user: { _id, email, name } });
    });
  } catch (error) {
    res.status(500).json(error);
  }

  // find the user based on ema
};

exports.signout = (req, res) => {
  res.clearCookie("t");
  return res.json({ message: "signout successful" });
};
exports.requiresignin = expressjwt({
  // if the token is valid express-jwt appends the verified user id
  //it is an auth key
  secret: process.env.JWT_SECRET,
  userProperty: "auth",
});
