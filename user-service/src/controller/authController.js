const {
  findOneByEmail,
  findOneByUsername,
  createNewUser,
  updateLoginCountAndToken,
  findOneById,
  updateOneUser,
} = require("../repository/user.repo");
const bcryptjs = require("bcryptjs");
const { generateToken } = require("../utils/token");
const { safeStringify } = require("../utils/utils");
const { generateOTP, sendVerificationEmail } = require("../utils/otp");

exports.signup = async (req, res) => {
  const { email, username, phone, password, age, gender, firstName, lastName } =
    req.body;

  //   const hashedPassword =
  const userData = {
    email,
    username,
    phone,
    password, // This will be hashed by the pre-save hook
    age,
    gender,
    firstName,
    lastName,
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

        await sendVerificationEmail(email, generateOTP());
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
    console.log("user:- " + user);
    if (user) {
      try {
        if (!user.password) {
          return res.status(500).json({
            code: 500,
            key: "Error",
            data: null,
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

        // Validate the assword using callback style
        bcryptjs.compare(
          password,
          user.password,
          async (err, isPasswordValid) => {
            if (err) {
              return res.status(500).json({
                code: 500,
                key: "Error",
                data: null,
                dsecrip: "Error validating credentials",
              });
            }
            console.log("isPasswordValid: - " + isPasswordValid);

            if (!isPasswordValid) {
              return res.status(401).json({
                code: 401,
                key: "Error",
                data: null,
                description: "Oops! Invalid credentials",
              });
            }

            // Proceed with the login count update and resposne
            const loginCount = isNaN(user.loginCount) ? 0 : user.loginCount;

            // generate jwt token
            const token = generateToken(user);

            try {
              console.log("run updateLoginCountAndToken: ");
              // Update login count and token, then send response
              await updateLoginCountAndToken(user, loginCount, token, res);
            } catch (updateError) {
              return res.status(500).json({
                code: 500,
                key: "Error",
                description: "Error updating login count or token",
                error: updateError.toString(),
              });
            }
          }
        );

        // const existingUser = await validatePassword(email, username, password);
        // console.log("existingUser:- " + JSON.stringify(existingUser));
      } catch (validationError) {
        console.error("Validation error: " + validationError);
        return res.status(400).json({
          code: 400,
          key: "Validation Error",
          error: validationError.message,
          description: "Validation failed for the login request",
        });
      }
    }

    // if (email && isEmailExist) {

    // }

    // console.log("isEmailExist: " + JSON.stringify(isEmailExist));
    // console.log("isUsernameExist: " + JSON.stringify(isUsernameExist));
    // return res.status(200).json({
    //   descrip: "login",
    // });
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

exports.getUser = async (req, res) => {
  const userId = req.params._id;

  const getUser = await findOneById(userId);
  console.log("getUser: " + getUser);

  //! Log specific parts of the request object to avoid circular references
  // console.log("req.query: ", req.query); // Logs query parameters
  // console.log("req.body: ", req.body); // Logs the request body
  // console.log("req.params: ", req.params); // Logs URL parameters
  // console.log("req.headers: ", req.headers); // Logs request headers

  return res.status(200).json({
    code: 200,
    status: "success",
    descrip: "User retrieved!",
    data: getUser,
  });
};

exports.updateUser = async (req, res) => {
  const _userId = req.params._id;
  const userData = req.body;
  // console.log("_userId - " + _userId);
  // console.log("userData - " + JSON.stringify(userData));

  const updateUser = await updateOneUser(_userId, userData, res);
  // console.log("updateUser - " + updateUser.name);
  console.log("updateUser.body - " + updateUser.body);
  console.log("------------");
  console.log("updateUser - " + safeStringify(updateUser));
};

exports.otp = async (req, res) => {
  const { email } = req.body;

  await sendVerificationEmail(email, generateOTP(), res);
};
