const express = require("express");
const userRoutes = express.Router();
const UsersController = require('../../controllers/user.controller');
const { userValidator } = require('../../validators/user.validator');
const Auth = require('../../middlewares/auth.middleware');

userRoutes.post('/sendOTP', userValidator, UsersController.sendOTP);
userRoutes.post('/login', userValidator, UsersController.login);
userRoutes.get('/', Auth.verifyToken, UsersController.getAllUsers);
userRoutes.get('/:id', Auth.verifyToken, UsersController.getUserInfo);
userRoutes.delete('/:id', Auth.verifyToken, UsersController.removeUser);

module.exports = userRoutes;


