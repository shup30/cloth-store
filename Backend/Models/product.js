const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
  },
  subtype: {
    type: String,
  },
  price: {
    type: String,
  },
  postedBy: {
    type: ObjectId,
    ref: "User",
  },
  photo: {
    data: Buffer,
    contenType: String,
  },
});

module.exports = mongoose.model("Product", productSchema);
