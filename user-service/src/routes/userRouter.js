const express = require("express");
const userSchema = require("../models/userSchema");
const authController = require("../controller/authController");
const UserRouter = express.Router();

// export const CreateUser = async (req, res) => {
//   const { name, age } = req.body;
// };

UserRouter.post("/signup", authController.signup);
UserRouter.post("/login", authController.login);
UserRouter.get("/:_id", authController.getUser);
UserRouter.put("/:_id", authController.updateUser);

// UserRouter.post("/", async (req, res) => {
//   try {
//     const user = new userSchema(req.body);
//     const savedUser = await user.save();
//     res.status(201).json(savedUser);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

module.exports = UserRouter;
