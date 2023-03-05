const _ = require("lodash");
const User = require("../models/user");
const formidable = require("formidable");
const fs = require("fs");
const bcrypt = require("bcrypt");

exports.userbyid = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "user not found",
      });
    }
    // add profile object in req with user info
    req.profile = user;
    next();
  });
};

exports.hasauthorization = (req, res, next) => {
  const authorised =
    req.profile && req.auth && req.profile._id === req.auth._id;
  if (!authorised) {
    return res.status(403).json({
      error: "User is not authorised to perform this action",
    });
  }
};

exports.getuser = (req, res) => {
  console.log("get user.........");
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  return res.json(req.profile);
};

exports.updateuser = async (req, res, next) => {
  try {
    console.log("inside .........");
    const userId = req.params.userId;
    //res.send("hello" + userId);
    console.log("id is ", userId, req.body.password);
    const user = await User.findById(userId);
    const hashed_password = await bcrypt.hash(req.body.password, 10);
    console.log("hashed passworld is ", hashed_password);
    var result;
    if (user) {
      result = await User.findByIdAndUpdate(userId, {
        $set: {
          name: req.body.name,
          hashed_password,
        },
      });
    } else {
      result = {
        status: 400,
        hashed_password,
      };
    }
    console.log("result: ", result);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(400).json({
        error: "somthing went wrong...",
      });
    }
  } catch (error) {
    console.log("error in update user profile", error);
  }

  // let form = new formidable.IncomingForm();
  // form.keepExtensions = true;
  // form.parse(req, (err, fields, files) => {
  //   let user = req.profile;
  //   user = _.extend(user, fields);
  //   user.updated = Date.now();

  //   user.save((err, result) => {
  //     if (err) return res.status(400).json({ error: err });
  //     user.hashed_password = undefined;
  //     user.salt = undefined;
  //     res.json(user);
  //   });
  // });
};
