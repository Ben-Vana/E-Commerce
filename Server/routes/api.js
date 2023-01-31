const express = require("express");
const router = express.Router();
const authRoute = require("./users/auth");
const productRoute = require("./products/products");
const userCartRoute = require("./users/userCart");
const usersRoute = require("./users/usersInfo");
const reviewsRoute = require("./products/reviews");

router.use("/auth", authRoute);
router.use("/product", productRoute);
router.use("/usercart", userCartRoute);
router.use("/users", usersRoute);
router.use("/review", reviewsRoute);

module.exports = router;
