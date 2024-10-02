const express = require("express");
const router = express.Router();
const countUserWithHardware = require("../controllers/userWithHardwaresControllers");


router.get("/", countUserWithHardware.countUserWithHardware);

module.exports = router;