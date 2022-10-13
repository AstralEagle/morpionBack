const express = require('express');
const router = express.Router();
const control = require("../controleur/user")

const auth = require('../midlware/auth')

router.get("/", control.getListPoints);
router.get("/sign/", auth, control.getSign)
router.get("/:id/", auth, control.getUserInfo);


module.exports = router;