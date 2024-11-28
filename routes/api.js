const express = require('express');
const router = express.Router();
const ValidatorSchema = require("../utils/validator-schema");
const validateReqBody = require('../middleware/validation')
const UserController = require('../controllers/authController');

const validator = new ValidatorSchema();
const userController = new UserController();
router.post("/register",validateReqBody(validator.createUserSchema), userController.create.bind(userController));

module.exports = router