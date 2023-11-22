const express = require('express');
const router = express.Router();
const departmentControllers = require('../controllers/departmentControllers');

router.post('/', departmentControllers.createDepartment);
router.get('/', departmentControllers.getAllDepartments);
router.get('/:id', departmentControllers.getDepartmentById);
router.put('/:id', departmentControllers.updateDepartment);
router.delete('/:id', departmentControllers.deleteDepartment);

module.exports = router;
