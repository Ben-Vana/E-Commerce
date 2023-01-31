const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const googleUserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: false },
  admin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  shoppingCart: [{ type: mongoose.Schema.Types.ObjectId, ref: "products" }],
  reviews: [
    {
      productId: { type: Schema.Types.ObjectId, ref: "products" },
      description: { type: Array },
      rating: { type: Number },
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

const GoogleUsers = mongoose.model("googleusers", googleUserSchema, "users");

const createGoogleUser = (user) => {
  const newUser = new GoogleUsers(user);
  return newUser.save();
};

module.exports = { createGoogleUser };
