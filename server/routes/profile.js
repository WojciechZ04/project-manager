const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile');
const authenticateToken = require('../authenticateToken');

router.get('/', authenticateToken, profileController.getProfile);
router.put('/:id', authenticateToken, profileController.updateProfile);
router.delete('/:id', authenticateToken, profileController.deleteProfile);

module.exports = router;