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
  return exisitngUser;
};

exports.updateLoginCountAndToken = async (user, loginCount, token, res) => {
  try {
    // Update the login count and token
    await userSchema.updateOne(
      {
        _id: user._id,
      },
      {
        $set: {
          loginCount: loginCount + 1,
          token: token,
        },
      }
    );

    // set the token in the cookie
    res.cookie("token", token, {
      httpOnly: true,
    });

    return res.status(200).json({
      code: 200,
      description: `Hello ${user.firstName}!`,
      token: token,
    });
  } catch (err) {
    return res.status(500).json({
      code: 500,
      key: "Error",
      error: err.toString(),
      description: "Error in updating login count",
    });
  }
};
