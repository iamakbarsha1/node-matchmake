const {
  findOneByEmail,
  findOneByUsername,
  createNewUser,
} = require("../repository/user.repo");
const bcryptjs = require("bcryptjs");

exports.signup = async (req, res) => {
  const { email, username, phone, password, age, gender } = req.body;

  //   const hashedPassword =
  const userData = {
    email,
    username,
    phone,
    password, // This will be hashed by the pre-save hook
    age,
    gender,
  };

  try {
    const [emailUnique, usernameUnique] = await Promise.all([
      email ? findOneByEmail(email) : null,
      username ? findOneByUsername(username) : null,
    ]);

    if (email && emailUnique) {
      return res.status(409).json({
        code: 409,
        type: "email",
        descrip: `${email} - email already exists!`,
      });
    }

    if (username && usernameUnique) {
      return res.status(409).json({
        code: 409,
        type: "username",
        descrip: `${username} - username already exists!`,
      });
    }

    let user = emailUnique || usernameUnique;
    if (user === null) {
      try {
        const savedUser = await createNewUser(userData);
        console.log("User created: " + savedUser._id);
        return res.status(201).json({
          code: 200,
          status: "Success",
          descrip: "New user created!",
          data: savedUser,
        });
      } catch (validationError) {
        console.error("Validation error: " + validationError);
        return res.status(400).json({
          code: 400,
          key: "Validation Error",
          error: validationError.message,
          description: "Validation failed for the signup request",
        });
      }
    }
  } catch (err) {
    console.error("Error in signup controller: " + err);
    return res.status(500).json({
      code: 500,
      key: "Error",
      err: err.toString(),
      descrip: "Error in signup controller",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const [isEmailExist, isUsernameExist] = await Promise.all([
      email ? findOneByEmail(email) : null,
      username ? findOneByUsername(username) : null,
    ]);
    let user = isEmailExist || isUsernameExist;

    if (user) {
      try {
        if (!user.password) {
          return res.status(500).json({
            code: 500,
            key: "Error",
            descrip: "Invalid credentials!",
          });
        }

        // Validate the password using callback style
        // bcryptjs.compare(
        //   password,
        //   user.password,
        //   function (err, isPasswordValid) {
        //     if (err) {
        //       return res.status(500).json({
        //         code: 500,
        //         key: "Error",
        //         description: "Error validating credentials",
        //       });
        //     }

        //     console.log("isPasswordValid -> " + isPasswordValid);

        //     if (!isPasswordValid) {
        //       return res.status(401).json({
        //         code: 401,
        //         key: "Error",
        //         description: "Oops! Invalid credentials",
        //       });
        //     }

        //     // Proceed with login count update and response
        //     const loginCount = isNaN(user.loginCount) ? 0 : user.loginCount;

        //     // Generate jwt token
        //     const token = generateToken(user);

        //     User.updateOne(
        //       { _id: user._id },
        //       { $set: { loginCount: loginCount + 1, token: token } }
        //     )
        //       .then(() => {
        //         res.cookie("token", token, { httpOnly: true });
        //         return res.status(200).json({
        //           code: 200,
        //           description: `Hello ${user.firstName}!`,
        //           token: token,
        //         });
        //       })
        //       .catch((err) => {
        //         return res.status(500).json({
        //           code: 500,
        //           key: "Error",
        //           error: err.toString(),
        //           description: "Error in updating login count",
        //         });
        //       });
        //   }
        // );

        const existingUser = await validatePassword(email, username, password);
      } catch (validationError) {}
    }

    // if (email && isEmailExist) {

    // }

    console.log("isEmailExist: " + JSON.stringify(isEmailExist));
    console.log("isUsernameExist: " + JSON.stringify(isUsernameExist));
    return res.status(200).json({
      descrip: "login",
    });
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
