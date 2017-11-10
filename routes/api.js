const express = require('express');
const router = express.Router();
const ctrlUsers = require('../controllers/users');
const ctrlProducts = require('../controllers/products');
const ctrlAuth = require('../controllers/authentication');

//Users
router.get('/users',ctrlUsers.listAllUsers);
router.post('/users',ctrlUsers.createNewUser);

//User Authentication
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

//Products
router.get('/products',ctrlProducts.listAllProducts);
router.post('/products',ctrlProducts.createNewProduct);

module.exports = router;