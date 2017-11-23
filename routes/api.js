const express = require('express');
const router = express.Router();
const jwt = require('express-jwt');
const auth = jwt({
	secret: process.env.JWT_SECRET,
	userProperty: 'payload'
});
const ctrlUsers = require('../controllers/users');
const ctrlProducts = require('../controllers/products');
const ctrlAuth = require('../controllers/authentication');


//Users
router.get('/users', auth, ctrlUsers.listAllUsers);
router.post('/users',auth ,ctrlUsers.createNewUser);
router.get('/users/:id',auth,ctrlUsers.getUser);
router.delete('/users/:id', auth, ctrlUsers.deleteUser);

//User Authentication
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);

//Products
router.get('/products', ctrlProducts.listAllProducts);
router.post('/products', auth, ctrlProducts.createNewProduct);
router.get('/products/newest',ctrlProducts.findNewest);
router.get('/products/popular',ctrlProducts.findPopular);
router.get('/products/:id', ctrlProducts.getProduct);
router.put('/products/:id', auth, ctrlProducts.editProduct);
router.delete('/products/', auth, ctrlProducts.deleteProduct);
router.put('/products/:id/stock', auth, ctrlProducts.editProductStock);
router.post('/products/:id/purchase', auth, ctrlProducts.purchaseProduct);

module.exports = router;