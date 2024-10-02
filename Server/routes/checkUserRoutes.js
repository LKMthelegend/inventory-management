const checkUserController = require("../controllers/checkUserControllers");
const express = require('express');
const router = express.Router();

router.get('/:userId', checkUserController.verificationUser);

module.exports = router;