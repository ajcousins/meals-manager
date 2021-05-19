const path = require("path");
const express = require("express");
const morgan = require("morgan");

const itemRouter = require("./routes/itemRouter");
const locationRouter = require("./routes/locationRouter");
const viewRouter = require("./routes/viewRouter");

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// MIDDLEWARE

// Serving static files. All static assets to be served from 'public' folder.
app.use(express.static(path.join(__dirname, "public")));

app.use(morgan("dev"));
app.use(express.json());
// For forms. Add fields to req.body.
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.use((req, res, next) => {
  console.log("Hello from the middleware");
  next();
});

// ROUTES

// app.get("/", (req, res) => {
//   res.status(200).render("layout");
// });
app.use("/", viewRouter);
app.use("/api/v1/items", itemRouter);
app.use("/api/v1/locations", locationRouter);

// START SERVER
module.exports = app;
