const mongoose = require("mongoose");

// Schema for data
const locationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A location must have a name."],
      trim: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/*
// Virtual for locaton URL
locationSchema.virtual("url").get(function () {
  const url = "/location/" + this._id;
  console.log(url);
  return url;
});
*/

// Virtual for locaton ID, for query string
locationSchema.virtual("id_query").get(function () {
  return "/?location=" + this._id;
});

// Create new model out of schema defined above:
const Location = mongoose.model("Location", locationSchema);

module.exports = Location;
