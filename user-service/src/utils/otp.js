const {
  findOneByEmail,
  updateOneUser,
  findOneByEmailAndUpdate,
} = require("../repository/user.repo");

exports.generateOTP = () => {
  //   let digits =
  //     "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+";
  let digits = "0123456789";
  let OTP = "";
  let len = digits.length;

  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * len)];
  }
  return OTP;
};

exports.sendVerificationEmail = async (email, generateOTP, res) => {
  console.log("email - " + JSON.stringify(email));
  console.log("generateOTP - " + JSON.stringify(generateOTP));

  const user = await updateOneUser(null, email, { otp: generateOTP }, res);
  // user.otp = generateOTP;
  // const user = await findOneByEmailAndUpdate(email, generateOTP, res);
  // console.log("user - " + user);

  return res.status(200).json({
    data: generateOTP,
    user: user,
  });
};
