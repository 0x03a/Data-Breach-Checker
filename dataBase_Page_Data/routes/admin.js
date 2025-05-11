const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const passwordController = require('../controllers/passwordController');

// User management
router.post('/users', userController.createUser);
router.get('/users', userController.getUsers);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

// Import passwords
router.post('/import-passwords', passwordController.importPasswords);
router.get('/passwords', passwordController.getPasswords);

// Password management routes
router.get('/breach-passwords', passwordController.getPasswords);
router.post('/breach-passwords', passwordController.addPassword);
router.delete('/breach-passwords/:id', passwordController.deletePassword);
router.post('/check-password-breach', passwordController.checkPasswordBreach);

module.exports = router; 