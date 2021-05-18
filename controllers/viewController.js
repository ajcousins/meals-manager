const Item = require("./../models/itemModel");
const Location = require("./../models/locationModel");

exports.getAllItems = async (req, res) => {
  try {
    console.log("Query object:", req.query);
    // console.log("Request object", req);

    // Filtering
    const queryObj = { ...req.query };
    const excludedFields = ["sort"];
    excludedFields.forEach((el) => delete queryObj[el]);

    console.log(queryObj);

    const title =
      queryObj.location === undefined ? "Overview" : queryObj.location;

    // let query = Item.find(req.query).populate("location").sort("-dateAdded");
    let query = Item.find(queryObj).populate("location");

    // Sorting
    // Check if there is a sort query.
    if (req.query.sort) {
      query = query.sort(req.query.sort);
    }

    const items = await query;
    const locations = await Location.find();

    res.status(200).render("overview", {
      title: title,
      currentLocationId: queryObj.location,
      locations,
      items,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: {
        item,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.createItem = async (req, res) => {
  try {
    const newItem = await Item.create(req.body);

    res.status(201).json({
      status: "Success",
      data: {
        item: newItem,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Invalid data sent",
    });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(201).json({
      status: "Success",
      data: {
        item: updatedItem,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Invalid data sent",
    });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: "Success",
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Invalid data sent",
    });
  }
};
