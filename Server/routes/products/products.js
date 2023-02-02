const fs = require("fs");
const path = require("path");
const express = require("express");
const multer = require("multer");
const router = express.Router();

const userInfo = require("../../middleware/userInfo.middleware");
const checkAdmin = require("../../middleware/admin.middleware");
const addFolder = require("../../middleware/addFolder.middleware");
const checkFolder = require("../../middleware/checkFolder");

const {
  validateProduct,
  validateEdit,
  validateId,
} = require("../../validation/product/product.validation");

const {
  createProduct,
  findProductById,
  updateProduct,
  deleteProduct,
  getProductsByName,
} = require("../../model/products/product.model");

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, req.folder),
  filename: (req, file, cb) => {
    const name = file.originalname.replace(",", "");
    cb(null, `${Date.now()}` + "_" + name);
  },
});

const upload = multer({ storage: fileStorage });

router.post(
  "/",
  userInfo,
  checkAdmin,
  addFolder,
  upload.array("images"),
  async (req, res) => {
    try {
      let imageArr = [];
      for (let i = 0; i < req.files.length; i++)
        imageArr.push(`${req.folderTime}/${req.files[i].filename}`);
      const descArr = req.body.description.split(",");
      for (let j = 0; j < descArr.length; j++)
        descArr[j] = descArr[j].replace(/{commaREPLACE}/gi, ",");
      const pQuantity = parseInt(req.body.quantity);
      const value = await validateProduct({
        name: req.body.name,
        price: req.body.price,
        description: descArr,
        image: imageArr,
        quantity: pQuantity,
      });
      const product = await createProduct({
        ...value,
        ownerId: req.userData.id,
      });
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ error });
    }
  }
);

router.patch(
  "/:pid",
  userInfo,
  checkAdmin,
  checkFolder,
  upload.array("images"),
  async (req, res) => {
    try {
      let imageArr = [];
      if (req.files.length) {
        for (let i = 0; i < req.files.length; i++)
          imageArr.push(`${req.folderTime}/${req.files[i].filename}`);
      }
      if (req.body.image) imageArr = imageArr.concat(req.body.image.split(","));
      const descArr = req.body.description.split(",");
      const delImages = req.body.delImages.split(",");
      const pQuantity = parseInt(req.body.quantity);
      const value = await validateEdit({
        id: req.params.pid,
        name: req.body.name,
        price: req.body.price,
        description: descArr,
        image: imageArr,
        quantity: pQuantity,
        delImages: delImages,
      });
      for (let i = 0; i < value.delImages.length; i++) {
        if (value.delImages[i]) {
          fs.unlinkSync(
            path.join(process.cwd() + `/public/images/${value.delImages[i]}`)
          );
        }
      }
      await updateProduct(value.id, {
        name: value.name,
        price: value.price,
        description: value.description,
        image: value.image,
        quantity: value.quantity,
      });
      res.status(200).json({ msg: "Product has been updated" });
    } catch (error) {
      res.status(400).json({ error });
    }
  }
);

router.delete("/:pid", userInfo, checkAdmin, async (req, res) => {
  try {
    const value = await validateId({ id: req.params.pid });
    const data = await findProductById(value.id);
    if (!data) throw "Product does not exist";
    const dir = data.image[0].split("/")[0];
    if (!dir) throw "Directory does not exist.";
    const dirPath = path.join(process.cwd() + `/public/images/${dir}`);
    if (!fs.existsSync(dirPath)) throw "Directory does not exist.";
    fs.rmdirSync(dirPath, { recursive: true, force: true });
    await deleteProduct(data._id);
    res.status(200).json({ msg: "Product has been deleted" });
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.get("/:productname", async (req, res) => {
  try {
    const products = await getProductsByName(req.params.productname);
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.get("/product/:id", async (req, res) => {
  try {
    let skip = req.query.p;
    let tempArr;
    const revPerPage = 10;
    const product = await findProductById(req.params.id);
    const length = product.productReviews.length;
    const limit = Math.ceil(length / revPerPage);
    if (skip) {
      if (skip === "1")
        tempArr = product.productReviews.slice(length - revPerPage * 1);
      else if (skip === `${limit}`)
        tempArr = product.productReviews.slice(
          0,
          Math.abs(revPerPage * parseInt(skip) - length - revPerPage)
        );
      else {
        tempArr = product.productReviews.slice(
          length - revPerPage * parseInt(skip),
          revPerPage + length - revPerPage * parseInt(skip)
        );
      }
      product.productReviews = tempArr;
      res.status(200).json({ product: product, limit: limit });
    } else res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ error });
  }
});

module.exports = router;
