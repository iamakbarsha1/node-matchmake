const userSchema = require("../models/userSchema");
const {
  findOneByEmail,
  findOneByUsername,
  createNewUser,
} = require("../repository/user.repo");
const { ErrorResponse } = require("../utils/response");

exports.signup = async (req, res) => {
  const { email, username, phone, password } = req.body;
  const userData = {
    email,
    username,
    phone,
    password,
  };
  console.log("req: " + JSON.stringify(req.body));

  try {
    const [emailUnique, usernameUnique] = await Promise.all([
      email ? findOneByEmail(email) : null,
      username ? findOneByUsername(username) : null,
    ]);

    if (email && emailUnique) {
      return res.status(201).json({
        code: 201,
        type: "email",
        descrip: `${email} - email already exists!`,
      });
    }

    if (username && usernameUnique) {
      return res.status(201).json({
        code: 201,
        type: "username",
        descrip: `${username} - username already exists!`,
      });
    }

    const isEmailExist = await findOneByEmail(email);
    console.log("isEmailExist: " + JSON.stringify(isEmailExist));

    const isUsernameExist = await findOneByUsername(username);
    console.log("isUsernameExist: " + JSON.stringify(isUsernameExist));

    let user = isEmailExist || isUsernameExist;

    if (user === null) {
      const savedUser = createNewUser(userData);
      console.error("User created: " + JSON.stringify(savedUser));
      res.status(201).json(savedUser);
    } else {
      return res.status(400).json({
        code: 400,
        descrip: "User already exists",
      });
    }
  } catch (err) {
    console.error("Error in register controller: " + err);
    return res.status(500).json({
      code: 500,
      key: "Error",
      err: err.toString(),
      descrip: "Error in signup controller",
    });
    // return ErrorResponse("Error", 500, err.toString(), "Error - @POST/signup");
  }
};

exports.login = async (req, res) => {
  try {
    const [isEmailExist, usernameExist] = await Promise.all([
      findOneByEmail,
      findOneByUsername,
    ]);

    console.log("isEmailExist: " + JSON.stringify(isEmailExist));
    console.log("usernameExist: " + JSON.stringify(usernameExist));
  } catch (err) {
    console.error("Error in login controller: " + err);
    // ErrorResponse(res, "Error", 500, err.toString(), "Error");
    return res.status(500).json({
      code: 500,
      key: "Error",
      err: err.toString(),
      descrip: "Error in login controller",
    });
  }
};
