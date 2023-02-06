const express = require("express");
const router = express.Router();

const userInfo = require("../../middleware/userInfo.middleware");
const {
  findUserById,
  getUsers,
  getUsersByName,
} = require("../../model/users/users.model");

router.get("/", async (req, res) => {
  try {
    const users = await getUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.get("/:name", async (req, res) => {
  try {
    const users = await getUsersByName(req.params.name);
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error });
  }
});

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
    res.status(201).json({
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
