const express = require('express');
const router = express.Router();
const ValidatorSchema = require("../utils/validator-schema");
const UserManagement = require('../controllers/UserManageementController')
const ROLES_LIST = require('../config/roles_list');
const verifyRoles =require('../middleware/verifyRole');

const verifyJWT = require('../middleware/verifyJWT')

const userManagement = new UserManagement();
router.get("/delete/:id",verifyJWT, verifyRoles(ROLES_LIST.Admin), userManagement.delete);

module.exports = router