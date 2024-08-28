const express = require('express');
const router = express.Router();
const signController = require('../controllers/sign');

router.post('/login', signController.login);
router.post('/signup', signController.signup);

module.exports = router;