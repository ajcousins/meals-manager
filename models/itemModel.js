const mongoose = require("mongoose");

// Schema for data
const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "An item must have a name."],
    trim: true,
  },
  portions: {
    type: Number,
    required: [true, "An item must have a number of portions."],
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location",
    required: true,
  },
  dateAdded: {
    type: Date,
    required: [true, "An item must have a dateAdded"],
    default: Date.now(),
  },
  eatByDate: {
    type: Date,
  },
  notes: {
    type: String,
  },
});

// Create new model out of schema defined above:
const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
