const userSchema = require("../models/userSchema");

exports.findOneByEmail = async (email) => {
  console.log("findOneByEmail: " + email);
  return await userSchema.findOne({ email });
};

exports.findOneByUsername = async (username) => {
  return await userSchema.findOne({ username });
};

exports.findOneById = async (_id) => {
  console.log("findOneById: " + _id);
  return await userSchema.findOne({ _id });
};

exports.createNewUser = async (userData) => {
  const user = new userSchema(userData);
  return await user.save();
};

// exports.updateOneUser = async (_id, data) => {
//   try {
//     console.log("updateOneUser: " + _id);
//     const updateUser = await userSchema.updateOne(
//       {
//         _id: _id,
//       },
//       {
//         $set: {
//           firstName: data.firstName,
//           lastName: data.lastName,
//           email: data.email,
//         },
//       }
//     );
//     return res.status(200).json({
//       code: 200,
//       description: `User updated!`,
//       data: "data - " + updateUser,
//     });
//   } catch (err) {
//     console.log("Error while updating a user: " + err);
//   }
// };
exports.updateOneUser = async (_id, email, data, res) => {
  try {
    // console.log("data - " + JSON.stringify(data));
    // Validate input
    if ((!_id && !email) || !data) {
      return res.status(400).json({
        code: 400,
        description: "Invalid request: Missing _id/email/data",
      });
    }

    // Destructure data for readability
    // const { firstName, lastName, email, otp } = data;

    // Prepare the query object
    const query = {};
    if (_id) query._id = _id; // Add _id to query if provided
    if (email) query.email = email; // Add email to query if provided

    console.log(`Updating user with query: ${JSON.stringify(query)}`);

    const updateFields = {};
    for (const key in data) {
      if (data[key] !== undefined) {
        updateFields[key] = data[key];
      }
    }
    // console.log("updateFields - " + JSON.stringify(updateFields));
    // Update user in the database
    const updateUser = await userSchema.updateOne(
      query,
      // { _id }, // shorthand for _id: _id
      {
        $set: updateFields,
        // $set: {
        //   firstName,
        //   lastName,
        //   email,
        // },
      }
    );

    // Check if any document was modified
    if (updateUser.modifiedCount === 0) {
      return res.status(404).json({
        code: 404,
        description: "User not found or no changes made.",
      });
    }

    // Success response
    return res.status(200).json({
      code: 200,
      description: "User updated successfully!",
      data: updateUser,
    });
  } catch (err) {
    console.error("Error while updating user:", err);

    // Internal server error response
    return res.status(500).json({
      code: 500,
      description: "An error occurred while updating the user.",
      error: err.message,
    });
  }
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
      description: `Hello ${user.fullName} ${user.name}!`,
      data: "data - " + token,
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

// exports.findOneByEmailAndUpdate = async (email, data, res) => {};
