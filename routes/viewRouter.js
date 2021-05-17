const express = require("express");
const viewController = require("./../controllers/viewController");

const router = express.Router();

router
  .route("/")
  .get(viewController.getAllItems)
  .post(viewController.createItem);

router
  .route("/:id")
  .get(viewController.getItem)
  .patch(viewController.updateItem)
  .delete(viewController.deleteItem);

module.exports = router;
