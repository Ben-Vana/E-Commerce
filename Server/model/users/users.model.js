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
      reported: { type: Boolean, default: false },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  reports: { type: Number, default: 0 },
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
  Users.findByIdAndUpdate(
    uId,
    { $pull: { userReviews: { reviewId: rId } } },
    { new: true }
  );

const addReport = (uId) =>
  Users.findByIdAndUpdate(uId, { $inc: { reports: 1 } });

const addReportedReview = async (uId, rId) => {
  const temp = await Users.findById(uId);
  for (let i = 0; i < temp.userReviews.length; i++) {
    if (temp.userReviews[i].reviewId.toString() === rId) {
      temp.userReviews[i].reported = true;
      break;
    }
  }
  return Users.findByIdAndUpdate(uId, { userReviews: temp.userReviews });
};

const getUsers = () => Users.find({});

const getUsersByName = (name) =>
  Users.find({ name: { $regex: name, $options: "i" } });

const switchAdmin = (id, setAdmin) =>
  Users.findByIdAndUpdate(id, { admin: setAdmin });

const resetReports = (id) => Users.findByIdAndUpdate(id, { reports: 0 });

const removeReport = async (uId, rId) => {
  const temp = await Users.findById(uId);
  for (let i = 0; i < temp.userReviews.length; i++) {
    if (temp.userReviews[i].reviewId.toString() === rId) {
      temp.userReviews[i].reported = false;
      break;
    }
  }
  return Users.findByIdAndUpdate(uId, { userReviews: temp.userReviews });
};

const deleteUser = (id) => Users.findByIdAndDelete(id);

const editCart = (uId, pId) =>
  Users.findByIdAndUpdate(uId, { $pull: { shoppingCart: pId } }, { new: true });

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
  getUsers,
  getUsersByName,
  switchAdmin,
  resetReports,
  removeReport,
  deleteUser,
  editCart,
};
