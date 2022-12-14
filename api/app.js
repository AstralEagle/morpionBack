const express = require("express");
const path = require("path");

const returnApp = (app, io) => {
  
  const routeAuth = require("./route/auth");
  const routeGame = require("./route/game")(io);
  const routeUser = require("./route/user");
  const routePlay = require("./play/playedGame")(io);
  const routeMarket = require('./route/market');

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
  app.use("/api/user/", routeUser);
  app.use("/api/market/", routeMarket);
  app.use("/sign/",express.static(path.join(__dirname,'img/sign')));

  return app;
};
module.exports = returnApp;
