const userSchema = require("../models/userSchema");

exports.findOneByEmail = async (email) => {
  return await userSchema.findOne({ email });
};

exports.findOneByUsername = async (username) => {
  return await userSchema.findOne({ username });
};

exports.createNewUser = async (userData) => {
  const user = new userSchema(userData);
  const savedUser = await user.save();
  res.status(201).json(savedUser);
};
