const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required!"],
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: [true, "Email address is required!"],
      unique: true,
      index: true,
    },
    password: {
      type: String,
    },
    name: {
      type: String,
      index: true,
      alais: "fullName",
      get: (value) => value.toUpperCase(),
      set: (value) => value.toLowerCase(),
    },
    gender: {
      type: String,
      required: [true, "Gender is requred!"],
      validate: [
        (value) => value.toLowerCase() === "male" || "female",
        "Gender should be either Male or Female!",
      ],
    },
    age: {
      type: Number,
      min: [
        18,
        "The value of path `{PATH}` ({VALUE}) is beneath the limit ({MIN}).",
      ],
      required: [true, "Age is required!"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
