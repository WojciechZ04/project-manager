const express = require('express');
const router = express.Router();
const projectsController = require('../controllers/projects');
const authenticateToken = require('../authenticateToken'); 

router.get('/', authenticateToken, projectsController.getProjects);
router.post('/', authenticateToken, projectsController.createProject);
router.get('/:projectId', authenticateToken, projectsController.getProject);
router.delete('/:projectId', authenticateToken, projectsController.deleteProject);
router.put('/:projectId', authenticateToken, projectsController.editProject);

module.exports = router;