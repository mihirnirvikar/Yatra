const userModel = require("../models/userModel");
const { createUser } = require("../services/userServices");
const { validationResult } = require("express-validator");

const register = async (req, res) => {
  const error = validationResult(req);
  console.log(error)
  res.send(error);
};

module.exports = { register };
