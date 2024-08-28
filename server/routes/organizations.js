const express = require('express');
const router = express.Router();
const organizationsController = require('../controllers/organizations');
const authenticateToken = require('../authenticateToken');

router.get('/', authenticateToken, organizationsController.getOrganizations);
router.post('/', authenticateToken, organizationsController.createOrganization);
router.post('/join', authenticateToken, organizationsController.joinOrganization);
router.get('/:id', organizationsController.getOrganizationDetails);

module.exports = router;