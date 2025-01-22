const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../services/Jwt/jwt");
const User = require("../Users/model");
const bcrypt = require("bcrypt");

const SignIn = async (req, res) => {
  let {password,} = req.body;
  let email = req.body.email.toLowerCase();
  try {
    if (!email) {
      return res.status(400).send({
        status: 400,
        message: "Email is required",
        success: false,
      });
    }
    if (!password) {
      return res.status(400).send({
        status: 400,
        message: "Password is missing",
        success: false,
      });
    }
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send({
        status: 404,
        message: "Could not find your profile!",
        success: false,
      });
    }

    if (user.isDeleted) {
      return res.status(404).send({
        status: 404,
        message:
          "No user found with that name. It’s possible your account has been deleted.",
        success: false,
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).send({
        status: 401,
        message: "Incorrect password",
        success: false,
      });
    }

    const accessToken = generateAccessToken({ id: user._id });
    const refreshToken = generateRefreshToken({ id: user._id });

    return res.status(200).json({
      message: "Logged in successfully",
      status: 200,
      success: true,
      accessToken: accessToken,
      refreshToken: refreshToken,
      data: user,
    });
  } catch (error) {
    console.error("Error occurred:", error);
    return res.status(500).json({
      status: 500,
      message: error.message || "An unexpected error occurred.",
      success: false,
    });
  }
};

module.exports = { SignIn };
