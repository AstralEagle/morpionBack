const express = require('express');
const router = express.Router();

const control = require('../controleur/auth')

const auth = require('../midlware/auth')

router.post('/signup',control.signup);
router.post('/login',control.login);
router.get('/',auth,control.auth)





module.exports = router;