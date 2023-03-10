const express = require("express");
const router = express.Router();

const userInfo = require("../../middleware/userInfo.middleware");
const { findProductById } = require("../../model/products/product.model");
const {
  findUserById,
  addToCart,
  getCart,
  editCart,
} = require("../../model/users/users.model");

router.post("/addproduct", userInfo, async (req, res) => {
  try {
    const product = await findProductById(req.body.pid);
    if (!product) throw "Product does not exist.";
    const user = await findUserById(req.userData.id);
    if (!user) throw "Please login.";
    let checkProduct = false;
    for (let i = 0; i < user.shoppingCart.length; i++)
      if (user.shoppingCart[i]._id.toString() === product._id.toString())
        checkProduct = true;
    if (!checkProduct) await addToCart(user.id, product);
    res.status(200).json({ msg: "item added" });
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.patch("/editcart", userInfo, async (req, res) => {
  try {
    const product = await findProductById(req.body.pid);
    if (!product) throw "Product does not exist.";
    const user = await findUserById(req.userData.id);
    if (!user) throw "Please login.";
    const shoppingCart = await editCart(user._id, product._id);
    res.status(200).json(shoppingCart);
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.get("/getcart", userInfo, async (req, res) => {
  try {
    const user = await findUserById(req.userData.id);
    if (!user) throw "Please login.";
    const cart = await getCart(user.id);
    res.status(200).json(cart);
  } catch (error) {
    res.status(400).json({ error });
  }
});

module.exports = router;
