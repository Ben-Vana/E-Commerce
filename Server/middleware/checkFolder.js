const fs = require("fs");
const path = require("path");
const { findProductById } = require("../model/products/product.model");

module.exports = checkFolder = async (req, res, next) => {
  try {
    const data = await findProductById(req.params.pid);
    if (!data) throw "Product does not exist.";
    const dirPath = data.image[0].split("/");
    const dir = path.join(process.cwd() + `/public/images/${dirPath[0]}`);
    if (!fs.existsSync(dir)) throw "Directory does not exist.";
    req.folder = dir;
    req.folderTime = dirPath[0];
    next();
  } catch (error) {
    res.status(400).json({ error });
  }
};
