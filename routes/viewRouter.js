const express = require("express");
const viewController = require("./../controllers/viewController");

const router = express.Router();

router.route("/").get(viewController.getAllItems);

router
  .route("/create")
  .get(viewController.newItemForm)
  .post(viewController.createItem);

router.route("/eatportion").post(viewController.eatPortion);

router
  .route("/item/:id")
  .get(viewController.updateItemGet)
  .post(viewController.updateItemPost);

router
  .route("/location/new")
  .get(viewController.locationCreateGet)
  .post(viewController.locationCreatePost);

router.route("/meal/:meal").get(viewController.getItemsByMeal);

router.route("/location/delete/:id").post(viewController.locationDeletePost);

router
  .route("/register")
  .get(viewController.registerUser)
  .post(viewController.registerUserPost);

router
  .route("/login")
  .get(viewController.getLogIn)
  .post(viewController.postLogIn);

router.route("/logout").get(viewController.logOut);

module.exports = router;
