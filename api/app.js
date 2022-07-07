const express = require("express");

const returnApp = (app, io) => {
  const routeAuth = require("./route/auth");
  const routeGame = require("./route/game");
  const routePlay = require("./play/playedGame")(io);

  let nbrRequest = 0;

  app.use(express.json());

  app.use((req, res, next) => {
    nbrRequest++;
    console.log(nbrRequest);

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    next();
  });


  app.use("/api/auth/", routeAuth);
  app.use("/api/game/", routeGame);
  app.use("/api/play/", routePlay);

  return app;
};
module.exports = returnApp;
