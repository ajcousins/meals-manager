const Item = require("./../models/itemModel");
const Location = require("./../models/locationModel");
const { body, validationResult } = require("express-validator");

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
    } else {
      query = query.sort("-dateAdded");
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

exports.newItemForm = async (req, res) => {
  try {
    console.log(req.route.path);
    const currentRoute = req.route.path;
    const locations = await Location.find();
    res.status(200).render("create", {
      locations,
      currentRoute,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.createItem = async (req, res) => {
  console.log(body.req);
  try {
    await Item.create({
      name: req.body.itemName,
      startingPortions: req.body.portions,
      remainingPortions: req.body.portions,
      location: req.body.location,
      meal: req.body.meal,
      eatByDate: req.body.eatBy,
      notes: req.body.notes,
    });

    res.status(200).redirect(301, "/");
  } catch (err) {
    res.status(400).json({
      status: "create fail",
      message: "Invalid data sent",
    });
  }
};

exports.eatPortion = async (req, res) => {
  try {
    if (req.body.remainingPortions * 1 < 2) {
      console.log("Delete Item");
      await Item.findByIdAndDelete(req.body.itemId);
    } else {
      const newPortions = req.body.remainingPortions - 1;
      await Item.findByIdAndUpdate(req.body.itemId, {
        remainingPortions: newPortions,
      });
    }

    console.log(req.body);

    res.status(201).redirect(301, "back");
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Invalid data sent",
    });
  }
};

exports.updateItemGet = async (req, res) => {
  try {
    console.log(req.params.id);
    const locations = await Location.find();
    const item = await Item.findById(req.params.id);
    res.status(200).render("updateItem", {
      locations,
      item,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.updateItemPost = async (req, res) => {
  try {
    console.log(req.body);
    let updatedStartingPortions;
    let updatedRemainingPortions;
    if (req.body.portions > req.body.startingPortions) {
      updatedStartingPortions = req.body.portions;
      updatedRemainingPortions = req.body.portions;
    } else {
      updatedStartingPortions = req.body.startingPortions;
      updatedRemainingPortions = req.body.portions;
    }
    await Item.findByIdAndUpdate(
      req.body.itemId,
      {
        name: req.body.itemName,
        startingPortions: updatedStartingPortions,
        remainingPortions: updatedRemainingPortions,
        meal: req.body.meal,
        location: req.body.location,
        eatByDate: req.body.eatBy,
        notes: req.body.notes,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(201).redirect(301, "/");
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "invalid data sent",
    });
  }
};

exports.locationCreateGet = async (req, res) => {
  try {
    console.log(req.route.path);
    const currentRoute = req.route.path;
    const locations = await Location.find();

    res.status(200).render("locationCreate", {
      locations,
      currentRoute,
    });
  } catch (err) {
    res.status(400).json({
      status: "create fail",
      message: "Invalid data sent",
    });
  }
};

exports.locationCreatePost = async (req, res) => {
  try {
    console.log(req.body);
    await Location.create({
      name: req.body.locationName,
    });
    res.status(201).redirect(301, "/");
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "invalid data sent",
    });
  }
};

exports.locationDeletePost = async (req, res) => {
  try {
    console.log("req.body", req.body);
    await Location.findByIdAndDelete(req.body.location);

    res.status(201).redirect(301, "/");
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "invalid data sent",
    });
  }
};

/*
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


*/
