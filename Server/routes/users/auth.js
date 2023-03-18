const express = require("express");
const router = express.Router();

const {
  validateLogin,
  validateEmail,
  validatePassword,
} = require("../../validation/auth/login.validation");

const {
  createUser,
  findByEmail,
  findUserById,
  updatePassword,
} = require("../../model/users/users.model");

const {
  validateRegister,
} = require("../../validation/auth/register.validation");

const { createGoogleUser } = require("../../model/users/googleUsers.model");
const { createHash, compareHash } = require("../../config/bcrypt");
const { generateToken, verifyToken } = require("../../config/jwt");
const sendResetMail = require("../../services/sendEmail");

router.post("/register", async (req, res) => {
  try {
    const value = await validateRegister(req.body);
    const user = await findByEmail(value.email);
    if (user) throw "Used Email";
    const hashPassword = await createHash(value.password);
    value.password = hashPassword;
    await createUser(value);
    res.status(201).json({ Message: "User has been created." });
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.post("/login", async (req, res) => {
  try {
    const value = await validateLogin(req.body);
    const user = await findByEmail(value.email);
    if (!user) throw "User does not exist.";
    const passwordMatch = compareHash(value.password, user.password);
    if (!passwordMatch) throw "Email or Password are incorrect.";
    const token = await generateToken({
      id: user._id,
      email: user.email,
      admin: user.admin,
    });
    res.status(200).json({ token });
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.post("/googlelogin", async (req, res) => {
  try {
    const user = await findByEmail(req.body.email);
    if (user) {
      const token = await generateToken({
        id: user._id,
        email: user.email,
        admin: user.admin,
      });

      res.status(200).json({ token });
    } else if (!user) {
      await createGoogleUser(req.body);
      const data = await findByEmail(req.body.email);
      const token = await generateToken({
        id: data._id,
        email: data.email,
        admin: data.admin,
      });

      res.status(200).json({ token });
    }
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.post("/forgotpassword", async (req, res) => {
  try {
    const value = await validateEmail({ email: req.body.email });
    console.log("hi");
    const userData = await findByEmail(value.email);
    if (!userData) throw "User not found";
    const tempToken = await generateToken({ email: userData.email }, "1h");
    const emailRes = await sendResetMail(userData.email, tempToken);
    if (!emailRes.messageId) throw "Check your Email";
    res.status(201).json({ msg: "Email send" });
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.post("/resetpassword/:token", async (req, res) => {
  try {
    const { password } = await validatePassword(req.body);
    const payload = await verifyToken(req.params.token);
    const userData = await findByEmail(payload.email);
    if (!userData) throw "User Doesn't Exist";
    const hashPassword = await createHash(password);
    await updatePassword(userData._id, hashPassword);
    res.json({ msg: "Password Changed" });
  } catch (error) {
    res.status(400).json({ error });
  }
});

module.exports = router;
