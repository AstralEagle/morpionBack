const express = require("express");

//MidlWare
const auth = require("../midlware/auth");
const control = require("../controleur/game");
const router = express.Router();

router.get("/", control.getAllGames);

router.get("/:id/", auth, control.getGame);
 
router.post("/", auth, control.createGame, control.setDefaultAccess);
router.post("/access/:id/", control.verifyPlaces, control.setAccess);


module.exports = router;
