const jwt = require("jsonwebtoken");
const User = require("../api/Users/model");

const Auth = () => async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "Token is missing",status: 401,success: false, });
    }

    const verifiedUser = jwt.verify(token, process.env.ACCESS_SECRET_KEY);
    const rootUser = await User.findOne({ _id: verifiedUser.id }).select("-password");

    if (!rootUser) {
      return res.status(401).json({ message: "Invalid Token",status: 401,success: false, });
    }

    req.token = token;
    req.rootUser = rootUser;
    req.rootUserId = rootUser._id;
    // console.log("req.rootUser",req.rootUser)

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res.status(401).json({ message: error.message, status: 401,success: false, });
  }
};

module.exports = {Auth};
