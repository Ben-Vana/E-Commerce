const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: { type: String, required: true },
  description: { type: Array, required: true },
  price: { type: String, required: true },
  image: { type: Array, required: true },
  quantity: { type: Number, required: true },
  ownerId: { type: Schema.Types.ObjectId, ref: "users" },
  rating: { type: Number, default: 0 },
  productReviews: [
    {
      _id: { type: Schema.Types.ObjectId },
      userId: { type: Schema.Types.ObjectId, ref: "users" },
      userName: { type: String },
      description: { type: Array },
      rating: { type: Number },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  views: { type: Number, dafault: 0 },
  createdAt: { type: Date, default: Date.now },
});

const Product = mongoose.model("products", productSchema);

const createProduct = (product) => {
  const newProduct = new Product(product);
  return newProduct.save();
};

const findProductById = (id) => Product.findById(id);

const updateProduct = (id, product) => Product.findByIdAndUpdate(id, product);

const deleteProduct = (id) => Product.findByIdAndDelete(id);

const updateRating = (id, newRating) =>
  Product.findByIdAndUpdate(id, { rating: newRating });

const getProductsByName = (product) =>
  Product.find({ name: { $regex: product, $options: "i" } });

const addReview = (pid, review) =>
  Product.findByIdAndUpdate(pid, { $push: { productReviews: review } });

const deleteReviewProduct = (pId, rId) =>
  Product.findByIdAndUpdate(
    pId,
    { $pull: { productReviews: { _id: rId } } },
    { new: true }
  );

const addView = (id) => Product.findByIdAndUpdate(id, { $inc: { views: 1 } });

const mostViewed = () => Product.find({}).sort({ views: -1 }).limit(10);

const highRate = () => Product.find({}).sort({ rating: -1 }).limit(1);

const mostRecent = () => Product.find({}).sort({ createdAt: -1 }).limit(10);

module.exports = {
  createProduct,
  findProductById,
  updateProduct,
  deleteProduct,
  updateRating,
  getProductsByName,
  addReview,
  deleteReviewProduct,
  addView,
  mostViewed,
  highRate,
  mostRecent,
};
