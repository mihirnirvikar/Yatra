const express = require("express");
const userRouter = express.Router();
const { register, login } = require("../controllers/userController");
const { body } = require("express-validator");

userRouter.post(
  "/register",
  [
    body("email")
      .isEmail()
      .isLength({ min: 6 })
      .withMessage("Invalid email address"),
    body("fullname.firstname")
      .isLength({ min: 3 })
      .withMessage("First name must be at least 3 characters long"),
    body("fullname.lastname")
      .isLength({ min: 3 })
      .withMessage("Last name must be at least 3 characters long"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  register,
);

userRouter.post(
  "/login",
  [
    body("email")
      .isEmail()
      .isLength({ min: 6 })
      .withMessage("Invalid email address"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  login,
);

module.exports = userRouter;
