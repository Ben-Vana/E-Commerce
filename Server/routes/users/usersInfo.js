const express = require("express");
const router = express.Router();

const userInfo = require("../../middleware/userInfo.middleware");
const { findUserById } = require("../../model/users/users.model");

router.get("/userinfo", userInfo, async (req, res) => {
  try {
    const user = req.userData;
    const value = await findUserById(user.id);
    res.status(201).json({ id: value._id, email: value.email });
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.get("/userreviewinfo", userInfo, async (req, res) => {
  try {
    const user = req.userData;
    const value = await findUserById(user.id);
    res
      .status(201)
      .json({
        id: value._id,
        name: value.name,
        email: value.email,
        userReviews: value.userReviews,
      });
  } catch (error) {
    res.status(400).json({ error });
  }
});

module.exports = router;
