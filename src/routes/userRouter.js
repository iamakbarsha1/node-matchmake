const express = require("express");
const userSchema = require("../models/userSchema");
const UserRouter = express.Router();

// export const CreateUser = async (req, res) => {
//   const { name, age } = req.body;
// };

UserRouter.post("/", async (req, res) => {
  try {
    const user = new userSchema(req.body);
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = UserRouter;
