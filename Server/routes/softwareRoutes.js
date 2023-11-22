const express = require('express');
const router = express.Router();
const softwareControllers = require('../controllers/softwareControllers');

router.post('/', softwareControllers.createSoftware);
router.get('/', softwareControllers.getAllSoftware);
router.get('/:id', softwareControllers.getSoftwareById);
router.put('/:id', softwareControllers.updateSoftware);
router.delete('/:id', softwareControllers.deleteSoftware);

module.exports = router;
