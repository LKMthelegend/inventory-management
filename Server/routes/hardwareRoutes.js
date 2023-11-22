const express = require('express');
const router = express.Router();
const hardwareControllers = require('../controllers/hardwareControllers');

router.post('/', hardwareControllers.createHardware);
router.get('/', hardwareControllers.getAllHardware);
router.get('/:id', hardwareControllers.getHardwareById);
router.put('/:id', hardwareControllers.updateHardware);
router.delete('/:id', hardwareControllers.deleteHardware);
router.get('/status', hardwareControllers.getHardwaresByStatus);

module.exports = router;
