const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const userInfo = require("../../middleware/userInfo.middleware");
const checkAdmin = require("../../middleware/admin.middleware");

const {
  validateReview,
} = require("../../validation/product/product.validation");

const {
  findProductById,
  updateRating,
  addReview,
  deleteReviewProduct,
} = require("../../model/products/product.model");

const {
  findUserById,
  addUserReview,
  deleteReviewUser,
  addReport,
  addReportedReview,
  removeReport,
} = require("../../model/users/users.model");

const { generateToken, verifyToken } = require("../../config/jwt");

router.post("/addreview", userInfo, async (req, res) => {
  try {
    const value = await validateReview({
      ...req.body,
    });
    const product = await findProductById(value.productId);
    if (!product) throw "Product does not exist.";
    const rating = value.rating;
    const reviewLength = product.productReviews.length;
    if (!product.rating) await updateRating(value.productId, rating);
    else {
      const averageRating =
        (product.rating * reviewLength + rating) / (reviewLength + 1);
      await updateRating(value.productId, averageRating);
    }
    const user = await findUserById(req.userData.id);
    const id = new mongoose.Types.ObjectId();
    await addReview(value.productId, {
      _id: id,
      userId: user._id,
      userName: user.name,
      description: value.description,
      rating: value.rating,
    });
    await addUserReview(user.id, {
      productId: value.productId,
      reviewId: id,
      description: value.description,
      rating: value.rating,
    });
    res.status(201).json({ msg: "Review added" });
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.patch("/addreport", async (req, res) => {
  try {
    await addReport(req.body.uId);
    await addReportedReview(req.body.uId, req.body.rId);
    res.status(200).json({ msg: "Added" });
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.patch("/removereport", async (req, res) => {
  try {
    await removeReport(req.body.uId, req.body.rId);
    res.status(200).json({ msg: "Done" });
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.post("/revtoken", userInfo, checkAdmin, async (req, res) => {
  try {
    const token = await generateToken(
      {
        pid: req.body.pid,
        rid: req.body.rid,
        uid: req.body.uid,
        rating: req.body.revRate,
      },
      "5m"
    );
    res.status(201).json(token);
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.delete(
  "/deletereview/:token",
  userInfo,
  checkAdmin,
  async (req, res) => {
    try {
      const payload = await verifyToken(req.params.token);
      const product = await findProductById(payload.pid);
      if (!product) throw "Product does not exist.";
      const pValue = await deleteReviewProduct(payload.pid, payload.rid);
      const uValue = await deleteReviewUser(payload.uid, payload.rid);
      const reviewLength = pValue.productReviews.length;
      if (reviewLength === 0) await updateRating(payload.pid, 0);
      else {
        const averageRating =
          (product.rating * (reviewLength + 1) - payload.rating) / reviewLength;
        await updateRating(payload.pid, averageRating);
      }
      res.status(200).json(uValue);
    } catch (error) {
      res.status(400).json({ error });
    }
  }
);

module.exports = router;
