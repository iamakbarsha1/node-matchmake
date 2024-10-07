const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

const validateGender = () => {
  return (value) => value.toLowerCase() === "male" || "female";
};

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
    //! this below 'name' is marked as a bug -> alais, get, set value
    name: {
      type: String,
      index: true,
      alais: "fullName",
      // get: (value) => value.toUpperCase(),
      // set: (value) => value.toLowerCase(),
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    gender: {
      type: String,
      required: [true, "Gender is requred!"],
      validate: [validateGender, "Gender should be either 'male' or 'female'!"],
    },
    age: {
      type: Number,
      min: [
        18,
        "The value of path `{PATH}` ({VALUE}) is beneath the limit ({MIN}).",
      ],
      required: [true, "Age is required!"],
    },
    loginCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    virtuals: {
      fullName: {
        get() {
          return this.firstName + " " + this.lastName;
          // return "test: - " + this.gender;
        },
      },
    },
  }
);

// Pre-save hook to hash the password
userSchema.pre("save", function (next) {
  const user = this;

  // Check if password exists
  if (!user.password) {
    return next(new Error("Password is required"));
  }

  // only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();

  // Generate a salt and hash the password
  bcryptjs.hash(user.password, 8, (err, hash) => {
    if (err) return next(err);

    // Replace the plain text with the hash
    user.password = hash;
    next();
  });
});

module.exports = mongoose.model("User", userSchema);
