const jwt = require("jsonwebtoken");

const generateToken = (payload, expDate = "30d") => {
  return new Promise((reslove, reject) => {
    return jwt.sign(
      payload,
      process.env.JWT,
      { expiresIn: expDate },
      (error, token) => {
        if (error) reject(error);
        else reslove(token);
      }
    );
  });
};

const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    return jwt.verify(token, process.env.JWT, (error, payload) => {
      if (error) reject(error);
      else resolve(payload);
    });
  });
};

module.exports = { generateToken, verifyToken };
