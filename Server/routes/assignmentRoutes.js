const express = require('express');
const router = express.Router();
const assignmentControllers = require('../controllers/assignmentControllers');

router.post('/', assignmentControllers.createAssignment);
router.get('/', assignmentControllers.getAllAssignments);
router.get('/:id', assignmentControllers.getAssignmentById);
router.delete('/:assignmentId', assignmentControllers.releaseHardware);
module.exports = router;
