const express = require("express");
const router = express.Router();
const ValidatorSchema = require("../utils/validator-schema");
const validateReqBody = require("../middleware/validation");
const UserController = require("../controllers/authController");
const verifyJWT = require("../middleware/verifyJWT");

const validator = new ValidatorSchema();
const userController = new UserController();
router.post(
  "/register",
  validateReqBody(validator.createUserSchema),
  userController.create
);
router.post(
  "/login",
  validateReqBody(validator.loginUserSchema),
  userController.login
);
router.get("/logout", verifyJWT, userController.logout);
router.get("/refresh", userController.refreshToken);

module.exports = router;
