const express = require('express');
const router = express.Router();
const UserController = require('../controllers/authController');

const userController = new UserController();
router.post('/', userController.create)

module.exports = router