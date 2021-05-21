const path = require("path");
const express = require("express");
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
