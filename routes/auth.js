const express = require('express');
const router = express.Router();
const ValidatorSchema = require("../utils/validator-schema");
const validateReqBody = require('../middleware/validation')
const UserController = require('../controllers/authController');
const verifyJWT = require('../middleware/verifyJWT')

const validator = new ValidatorSchema();
const userController = new UserController();
router.post("/login",validateReqBody(validator.loginUserSchema), userController.login.bind(userController));
router.get("/logout", verifyJWT, userController.logout.bind(userController));

module.exports = router