const express = require('express');
const router = express.Router();
const ctrlUsers = require('../controllers/users');
const ctrlProducts = require('../controllers/products');

//Users
router.get('/users',ctrlUsers.listAllUsers);
router.post('/users',ctrlUsers.createNewUser);

//Products
router.get('/products',ctrlProducts.listAllProducts);
router.post('/products',ctrlProducts.createNewProduct);

module.exports = router;