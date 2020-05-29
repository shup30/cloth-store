const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const quotationSchema = new mongoose.Schema({
  cmp_name: {
    type: String,
    required: true,
  },
  issuer_name: {
    type: String,
  },
  issued_to: {
    type: String,
  },
  created: {
    type: Date,
    default: Date.now
  },
  item: {
    type: String,
  },
  description: {
    type: String,
  },
  qty: {
    type: String,
  },
  postedBy: {
    type: ObjectId,
    ref: "User",
  },
  price: {
    type: String,
  },
  total: {
    type: String,
  }
});

module.exports = mongoose.model("Quotation", quotationSchema);
