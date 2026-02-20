const userModel = require("../models/userModel");

const register = async (req, res) => {
  const { fullname, email, password } = req.body;
  res.json({ fullname, email, password });
};

module.exports = { register };
