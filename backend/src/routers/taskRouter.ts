const express = require('express');
const { getTasks, createTask, updateTask, deleteTask, getTaskById } = require('../controller/taskController');
const { validateTask } = require('../middleware/validation');

const router = express.Router();

router.get('/', getTasks);
router.get('/:id', getTaskById);
router.post('/', validateTask, createTask);
router.put('/:id', validateTask, updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
