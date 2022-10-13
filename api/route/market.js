const express = require('express');
const router = express.Router();

const controleur = require('../controleur/market')

const auth = require('../midlware/auth')


router.get('/',auth,controleur.getAllSkin)
router.post('/:id',auth,controleur.setSign)

module.exports = router