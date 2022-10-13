const express = require("express");

//MidlWare

module.exports = (io) => {
    const auth = require("../midlware/auth");
    const control = require("../controleur/game");
    const router = express.Router();
    control.io = io;
  
    router.get("/", control.getAllGames);
    router.get("/mygame/", auth, control.getMyGames);
  
    router.get("/:id/", auth, control.getGame);
    router.get("/users/:id/",control.getUsersGame);
  
    router.post("/", auth, control.createGame, control.setDefaultAccess);
    router.post("/access/:id/", auth, control.verifyPlaces, control.setAccess, control.notifyNewAccess);
  
    return router;
};
