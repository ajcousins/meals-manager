const bcrypt = require("bcryptjs");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const Item = require("./../models/itemModel");
const Location = require("./../models/locationModel");
const User = require("./../models/userModel");

exports.getAllItems = async (req, res) => {
  try {
    // Current user
    console.log(res.locals.currentUser);

    // Filtering
    const queryObj = { ...req.query };

    if (res.locals.currentUser === undefined) {
      // Add demo account to query obj
      queryObj.user = {
        _id: "60ae7aca35a25e14184ffc3c",
      };
    } else {
      // Add current user to query obj
      queryObj.user = res.locals.currentUser;
    }

    const excludedFields = ["sort"];
    excludedFields.forEach((el) => delete queryObj[el]);

    const title =
      queryObj.location === undefined ? "Overview" : queryObj.location;

    let query = Item.find(queryObj).populate("location");

    // Sorting
    // Check if there is a sort query. If not, apply default.
    if (req.query.sort) {
      query = query.sort(req.query.sort);
    } else {
      query = query.sort("eatByDate");
    }

    console.log("queryObj:", queryObj);

    const items = await query;
    const locations = await Location.find({
      user: queryObj.user._id,
    });

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

exports.getItemsByMeal = async (req, res) => {
  try {
    const currentRoute = req.route.path;
    let queryString = [...req.params.meal].join("");
    const title = queryString.charAt(0).toUpperCase() + queryString.slice(1);

    const queryObj = {
      meal: title,
    };

    if (res.locals.currentUser === undefined) {
      // Add demo account to query obj
      queryObj.user = {
        _id: "60ae7aca35a25e14184ffc3c",
      };
    } else {
      // Add current user to query obj
      queryObj.user = res.locals.currentUser;
    }

    console.log("queryObj:", queryObj);

    const items = await Item.find(queryObj)
      .sort(req.query.sort)
      .populate("location");

    const locations = await Location.find({
      user: queryObj.user._id,
    });

    res.status(200).render("meal", {
      status: "works",
      items,
      title,
      locations,
      currentRoute,
      demoUser: { id: "60ae7aca35a25e14184ffc3c" },
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
    const queryObj = {};
    if (res.locals.currentUser === undefined) {
      // Add demo account to query obj
      queryObj.user = {
        _id: "60ae7aca35a25e14184ffc3c",
      };
    } else {
      // Add current user to query obj
      queryObj.user = res.locals.currentUser;
    }

    const currentRoute = req.route.path;
    const locations = await Location.find({
      user: queryObj.user._id,
    });
    res.status(200).render("create", {
      locations,
      currentRoute,
      demoUser: { id: "60ae7aca35a25e14184ffc3c" },
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
    await Item.create({
      name: req.body.itemName,
      startingPortions: req.body.portions,
      remainingPortions: req.body.portions,
      location: req.body.location,
      meal: req.body.meal,
      eatByDate: req.body.eatBy,
      notes: req.body.notes,
      user: req.body.userId,
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
      await Item.findByIdAndDelete(req.body.itemId);
    } else {
      const newPortions = req.body.remainingPortions - 1;
      await Item.findByIdAndUpdate(req.body.itemId, {
        remainingPortions: newPortions,
      });
    }

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
    const queryObj = {};
    if (res.locals.currentUser === undefined) {
      // Add demo account to query obj
      queryObj.user = {
        _id: "60ae7aca35a25e14184ffc3c",
      };
    } else {
      // Add current user to query obj
      queryObj.user = res.locals.currentUser;
    }

    const locations = await Location.find({ user: queryObj.user._id });
    const item = await Item.findById(req.params.id);
    res.status(200).render("updateItem", {
      locations,
      item,
      demoUser: { id: "60ae7aca35a25e14184ffc3c" },
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
    let updatedStartingPortions;
    let updatedRemainingPortions;
    // Check if new starting portions is more than original starting portions.
    // If so, adjust starting portions. If not, only adjust remaining portions.
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
    const queryObj = {};
    if (res.locals.currentUser === undefined) {
      // Add demo account to query obj
      queryObj.user = {
        _id: "60ae7aca35a25e14184ffc3c",
      };
    } else {
      // Add current user to query obj
      queryObj.user = res.locals.currentUser;
    }

    const currentRoute = req.route.path;
    const locations = await Location.find({ user: queryObj.user._id });

    res.status(200).render("locationCreate", {
      locations,
      currentRoute,
      demoUser: { id: "60ae7aca35a25e14184ffc3c" },
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
    await Location.create({
      name: req.body.locationName,
      user: req.body.userId,
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
    await Location.findByIdAndDelete(req.body.location);

    res.status(201).redirect(301, "/");
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "invalid data sent",
    });
  }
};

exports.registerUser = (req, res) => {
  let errorMessage;
  if (req.query.e === "01") errorMessage = "Please enter a username.";
  if (req.query.e === "02") errorMessage = "Please enter a password.";
  if (req.query.e === "03")
    errorMessage = "Password confirmation does not match.";
  if (req.query.e === "04")
    errorMessage = "Username already exists. Try signing in?";

  res.status(200).render("register", { errorMessage });
};

exports.registerUserPost = async (req, res) => {
  // No username
  if (!req.body.username) res.redirect("/register?e=01");
  // No password
  else if (!req.body.password) res.redirect("/register?e=02");
  // Password and confirmation do not match
  else if (req.body.password != req.body.confirm)
    res.redirect("/register?e=03");
  else {
    await User.findOne({ username: req.body.username }, (err, user) => {
      // Does username already exist?
      if (user) res.redirect("/register?e=04");
      // If not, hash password, save user to database and redirect to login.
      else {
        bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
          if (err) {
            return next(err);
          }
          new User({
            username: req.body.username,
            password: hashedPassword,
          }).save((err) => {
            if (err) {
              return next(err);
            }
            res.redirect("/login");
          });
        });
      }
    });
  }
};

exports.getLogIn = (req, res) => {
  res.status(200).render("login");
};

exports.postLogIn = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
});

exports.logOut = (req, res) => {
  req.logout();
  res.redirect("/");
};

// Passport Functions
passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Incorrect password" });
        }
      });
    });
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});
