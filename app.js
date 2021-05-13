const express = require("express");
const morgan = require("morgan");

const itemRouter = require("./routes/itemRouter");

const app = express();

// MIDDLEWARE

app.use(morgan("dev"));

app.use((req, res, next) => {
  console.log("Hello from the middleware");
  next();
});

// ROUTES
app.use("/api/v1/items", itemRouter);

// START SERVER
module.exports = app;
