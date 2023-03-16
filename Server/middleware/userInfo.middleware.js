const { verifyToken } = require("../config/jwt");
const { findUserById } = require("../model/users/users.model");

const authUser = async (req, res, next) => {
  try {
    const payload = await verifyToken(req.headers["auth-token"]);
    const user = await findUserById(payload.id);
    if (!user) throw "User does not exist";
    payload.admin = user.admin;
    req.userData = payload;
    next();
  } catch (error) {
    res.status(400).json({ error });
  }
};

module.exports = authUser;
