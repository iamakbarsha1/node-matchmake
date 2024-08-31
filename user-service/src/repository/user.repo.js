const userSchema = require("../models/userSchema");

exports.findOneByEmail = async (email) => {
  console.log("findOneByEmail: " + email);
  return await userSchema.findOne({ email });
};

exports.findOneByUsername = async (username) => {
  return await userSchema.findOne({ username });
};

exports.createNewUser = async (userData) => {
  const user = new userSchema(userData);
  return await user.save();
};

exports.validatePassword = async (email, username, password) => {
  const exisitngUser = await userSchema.findOne({ email });
};
