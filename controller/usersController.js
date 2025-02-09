// external imports
const bcrypt = require("bcrypt");
const { unlink } = require("fs");
const path = require("path");

// internal imports
const User = require("../models/People");

//  ************ Most important - used - Start ************
// add user
async function addUser(req, res, next) {
  let newUser;
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  if (req.files && req.files.length > 0) {
    newUser = new User({
      ...req.body,
      image: req.files[0].filename,
      password: hashedPassword,
    });
  } else {
    newUser = new User({
      ...req.body,
      password: hashedPassword,
    });
  }

  // save user or send error
  try {
    const result = await newUser.save();
    res.status(200).json({
      message: "User was added successfully!",
    });
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: "Unknown error occured!",
        },
      },
    });
  }
}
//  ************ Most important - used - End ************



// get users page
async function getUsers(req, res, next) {
  try {
    const users = await User.find();
    res.render("users", {
      users: users,
    });
  } catch (err) {
    next(err);
  }
}
// remove user
async function removeUser(req, res, next) {
  try {
    const user = await User.findByIdAndDelete({
      _id: req.params.id,
    });

    // remove user image if any
    if (user.image) {
      unlink(
        path.join(__dirname, `/../public/uploads/images/${user.image}`),
        (err) => {
          if (err) console.log(err);
        }
      );
    }

    res.status(200).json({
      message: "User was removed successfully!",
    });
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: "Could not delete the user!",
        },
      },
    });
  }
}

module.exports = {
  getUsers,
  addUser,
  removeUser,
};
