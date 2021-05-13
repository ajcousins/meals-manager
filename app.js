const express = require("express");
const morgan = require("morgan");

const itemRouter = require("./routes/itemRouter");
const locationRouter = require("./routes/locationRouter");

const app = express();

// MIDDLEWARE

app.use(morgan("dev"));
app.use(express.json());

app.use((req, res, next) => {
  console.log("Hello from the middleware");
  next();
});

// ROUTES
app.use("/api/v1/items", itemRouter);
app.use("/api/v1/locations", locationRouter);

// START SERVER
module.exports = app;
