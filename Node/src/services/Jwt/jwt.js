const jwt = require("jsonwebtoken");
const access_key = process.env.ACCESS_SECRET_KEY;
const refresh_key = process.env.REFRESH_SECRET_KEY;

// Function to generate access token
function generateAccessToken(payload) {
    return jwt.sign(payload, access_key, {
      expiresIn: "2h",
    });
  }
  
  // Function to generate refresh token
  function generateRefreshToken(payload) {
    return jwt.sign(payload, refresh_key, {
        expiresIn: "7d",
      });
  }
  
  // Function to verify refresh token
function verifyRefreshToken(refreshToken) {
    // console.log("refreshToken",refreshToken)
    return new Promise((resolve, reject) => {
        jwt.verify(refreshToken, refresh_key, (err, decoded) => {
            if (err) {
                reject(err); 
            } else {
                resolve(decoded); 
            }
        });
    });
}

  module.exports = {generateAccessToken,generateRefreshToken,verifyRefreshToken}