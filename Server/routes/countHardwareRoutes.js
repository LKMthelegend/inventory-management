const express = require("express");
const router = express.Router();
const countHardwareController = require("../controllers/countHardwareController");

router.get('/', countHardwareController.getUsedHardwareCount);

module.exports = router;