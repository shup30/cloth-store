const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: String,
  },
  postedBy: {
    type: ObjectId,
    ref: "User",
  }
});


module.exports = mongoose.model("Product", productSchema);
