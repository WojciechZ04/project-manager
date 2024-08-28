const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home');
const authenticateToken = require('../authenticateToken');

router.get('/', authenticateToken, homeController.getHome);

module.exports = router;