const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  admin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  shoppingCart: [{ type: mongoose.Schema.Types.ObjectId, ref: "products" }],
  userReviews: [
    {
      productId: { type: Schema.Types.ObjectId, ref: "products" },
      reviewId: { type: Schema.Types.ObjectId, ref: "products" },
      description: { type: Array },
      rating: { type: Number },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  reports: { type: Number, default: 0 },
  reportedReviews: [{ type: Schema.Types.ObjectId, ref: "products" }],
});

const Users = mongoose.model("user", userSchema, "users");

const createUser = (user) => {
  const newUser = new Users(user);
  return newUser.save();
};

const findByEmail = (email) => Users.findOne({ email });

const findUserById = (id) => Users.findById(id);

const updatePassword = (id, password) =>
  Users.findByIdAndUpdate(id, { password });

const addToCart = (id, product) =>
  Users.findByIdAndUpdate(id, { $push: { shoppingCart: product } });

const getCart = (id) => Users.findById(id).select("shoppingCart");

const addUserReview = (id, review) =>
  Users.findByIdAndUpdate(id, { $push: { userReviews: review } });

const deleteReviewUser = (uId, rId) =>
  Users.findByIdAndUpdate(uId, { $pull: { userReviews: { reviewId: rId } } });

const addReport = (uId) =>
  Users.findByIdAndUpdate(uId, { $inc: { reports: 1 } });

const addReportedReview = async (uId, rId) => {
  const user = await Users.findById(uId);
  let check = false;
  for (let i = 0; i < user.reportedReviews.length; i++) {
    if (user.reportedReviews[i].toString() === rId) {
      check = true;
      break;
    }
  }
  if (check) {
    return;
  } else {
    return Users.findByIdAndUpdate(uId, { $push: { reportedReviews: rId } });
  }
};

module.exports = {
  createUser,
  findByEmail,
  findUserById,
  updatePassword,
  addToCart,
  getCart,
  addUserReview,
  deleteReviewUser,
  addReport,
  addReportedReview,
};
