const mongoose = require("mongoose");

// Schema for data
const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "An item must have a name."],
      trim: true,
    },
    startingPortions: {
      type: Number,
      required: [true, "An item must have a number of starting portions."],
    },
    remainingPortions: {
      type: Number,
      required: [true, "An item must have a number of current portions."],
    },
    meal: {
      type: String,
      required: [true, "An item must have a name."],
      enum: ["Breakfast", "Lunch", "Dinner", "Snack", "Misc"],
      default: "Misc",
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create new model out of schema defined above:
const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
