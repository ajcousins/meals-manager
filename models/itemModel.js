const mongoose = require("mongoose");
const { DateTime } = require("luxon");

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
      required: [true, "An item must have an eatByDate"],
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

// Virtual for shortened/ display date.
itemSchema.virtual("dateAdded_med").get(function () {
  return this.dateAdded
    ? DateTime.fromJSDate(this.dateAdded).toLocaleString(DateTime.DATE_MED)
    : "-";
});

itemSchema.virtual("eatByDate_med").get(function () {
  return this.eatByDate
    ? DateTime.fromJSDate(this.eatByDate).toLocaleString(DateTime.DATE_MED)
    : "-";
});

// Correct formatting for html date input.
itemSchema.virtual("dateAdded_htmlForm").get(function () {
  return this.dateAdded
    ? DateTime.fromJSDate(this.dateAdded).toISODate()
    : null;
});

itemSchema.virtual("eatByDate_htmlForm").get(function () {
  return this.eatByDate
    ? DateTime.fromJSDate(this.eatByDate).toISODate()
    : null;
});

// Freshness
itemSchema.virtual("freshness").get(function () {
  // Return 24 hours as default so that item doesn't appear as 'Eat Today'.
  if (!this.eatByDate) return 24;
  else {
    // Convert difference in milliseconds to hours.
    return (
      Math.floor(
        (DateTime.fromJSDate(this.eatByDate) - DateTime.local()) /
          60 /
          60 /
          1000
      ) + 24
    );
  }
});

// Create new model out of schema defined above:
const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
