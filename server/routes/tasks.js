const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/tasks');
const authenticateToken = require('../authenticateToken');

router.get('/', authenticateToken, tasksController.getTasks);
router.post('/', authenticateToken, tasksController.createTask);
router.delete('/:projectId/:taskId', authenticateToken, tasksController.deleteTask)
router.put('/:taskId/', authenticateToken, tasksController.updateTaskStatus);

module.exports = router;