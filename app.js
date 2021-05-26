const path = require("path");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const morgan = require("morgan");
const compression = require("compression");
const helmet = require("helmet");

const itemRouter = require("./routes/itemRouter");
const locationRouter = require("./routes/locationRouter");
const viewRouter = require("./routes/viewRouter");

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// MIDDLEWARE

app.use(helmet());

// Compress all routes
app.use(compression());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Adds currentUser variable to res object so that currentUser is available in all views.
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

// Serving static files. All static assets to be served from 'public' folder.
app.use(express.static(path.join(__dirname, "public")));

app.use(morgan("dev"));
app.use(express.json());
// For forms. Add fields to req.body.
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// ROUTES
// Server-side rendered views
app.use("/", viewRouter);
// API
app.use("/api/v1/items", itemRouter);
app.use("/api/v1/locations", locationRouter);

// START SERVER
module.exports = app;
