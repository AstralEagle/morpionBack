const express = require("express");

//MidlWare
const auth = require("../midlware/auth");
const control = require("../controleur/game");
const router = express.Router();

router.get("/", control.getAllGames);
router.get("/mygame/",auth, control.getMyGames);

router.get("/:id/", auth, control.getGame);
 
router.post("/", auth, control.createGame, control.setDefaultAccess);
router.post("/access/:id/", auth, control.verifyPlaces, control.setAccess);


module.exports = router;
