const express = require('express');
const router = express.Router();
const control = require("../controleur/user")

router.get("/", control.getListPoints);
router.get("/:id/", control.getUserInfo);






module.exports = router;