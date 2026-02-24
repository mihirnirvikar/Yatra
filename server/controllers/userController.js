const userModel = require("../models/userModel");
const { createUser } = require("../services/userServices");
const { validationResult } = require("express-validator");

const register = async (req, res) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.status(400).json({ errors: error.array() });
  }

  try {
    const {
      email,
      fullname: { firstname, lastname },
      password,
    } = req.body;

    // check if user already exists
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const hashedPassword = await userModel.hashPassword(password);

    // create user
    const user = await createUser({
      fullname: { firstname, lastname },
      email,
      password: hashedPassword,
    });

    res.cookie("token", user.generateAuthToken(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.status(201).json({ user, message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.status(400).json({ errors: error.array() });
  }

  try {
    const { email, password } = req.body;

    // check if user exists
    const existingUser = await userModel.findOne({ email }).select("+password");

    if (!existingUser) {
      return res.status(400).json({ message: "User does not exist" });
    }

    // check if password is correct or not
    const isPasswordMatched = await existingUser.comparePassword(password);

    if (!isPasswordMatched) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.cookie("token", existingUser.generateAuthToken(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.status(200).json({ user: existingUser, message: "Login successful" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login };
