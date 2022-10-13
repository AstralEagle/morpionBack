const db = require("../../database/data");

exports.io = null;

exports.createGame = (req, res, next) => {
  let value = "Salle de morpion";
  if (req.body.name) {
    value = req.body.name;
  }
  const sql = "INSERT INTO plato(name) VALUES (?)";
  db.run(sql, value, (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send();
    } else {
      next();
    }
  });
};

exports.setDefaultAccess = (req, res, next) => {
  db.each("SELECT MAX(id) AS 'id' FROM plato", (err, idLastPlato) => {
    if (err) {
      console.error(err);
      res.status(500).send();
    } else {
      db.all(
        "SELECT * FROM player_access WHERE id_plato = ? AND id_player = ?",
        [idLastPlato.id, req.headers.authorization.split(" ")[2]],
        (err, data) => {
          if (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
          } else if (data.length > 0) {
            res.status(400).json({ error: "Vous etes deja dans la partie" });
          } else {
            const sql =
              "INSERT INTO player_access(id_plato,id_player,team) VALUES(?,?,?)";
            const values = [
              idLastPlato.id,
              req.headers.authorization.split(" ")[2],
              0,
            ];
            db.run(sql, values, (err) => {
              if (err) {
                console.error(err);
                res.status(500).send();
              } else {
                res.status(200).json({ msg: "Game created" });
              }
            });
          }
        }
      );
    }
  });
};

exports.verifyPlaces = (req, res, next) => {
  const SQL =
    "SELECT COUNT(DISTINCT id_player) as nbrPlace, id_player as player FROM player_access WHERE id_plato = ?";
  db.each(SQL, req.params.id, (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send();
    } else if (data.nbrPlace > 1) {
      res
        .status(400)
        .json({ error: "Il n'y a plus de place dans cette partie!" });
    } else if (data.player == req.headers.authorization.split(" ")[2]) {
      res.status(400).json({ error: "Vous avez déja rejoind cette partie!" });
    } else {
      next();
    }
  });
};

exports.setAccess = (req, res, next) => {
  //Ajoute un jouer a la parti req.iparams.id
  const sql =
    "INSERT INTO player_access(id_plato,id_player,team) VALUES(?,?,?)";
  const values = [req.params.id, req.headers.authorization.split(" ")[2], 1];

  db.run(sql, values, (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send();
    } else {
      //Prevenir l'autre jouer
      if(exports.io !==null){
        exports.io.to(`morpion${req.params.id}`).emit("PlayerJoin")
      }
      res.status(200).json({ msg: "Add access to player" });
    }
  });
};

exports.notifyNewAccess = (req, res, next) => {
  const sql = "SELECT id,name, sign, id FROM users WHERE id = ?"
  db.each(sql, req.headers.authorization.split(' ')[2], (err,data) => {
    if (err) {
      console.error(err);
      res.status(500).send();
    } else {
      console.log(data);
      const user = {
        id : data.id,
        team : 1,
        name : data.name,
        sign : data.sign
      }
      exports.io.to(`morpion${req.params.id}`).emit("PlayerJoin",{user})

    }
  })
}

exports.getAllGames = (req, res, next) => {
  const SQL =
    "SELECT plato.id as id, plato.name as name, plato.plato as plato,COUNT(DISTINCT player_access.id_player) as nbrPlayer FROM plato JOIN player_access ON player_access.id_plato = plato.id WHERE end = 0 GROUP BY plato.id HAVING COUNT(DISTINCT player_access.id_player) < 2";
  db.all(SQL, (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send();
    } else {
      data.map(
        (row) =>
          (row.plato = row.plato
            .replace("0", "X")
            .replace("1", "O")
            .split(" ")
            .map((el) => el.split("")))
      );
      res.status(200).json(data);
    }
  });
};

exports.getMyGames = (req, res, next) => {
  const SQL =
    "SELECT plato.id as id, plato.name as name, plato.plato as plato,(SELECT COUNT(DISTINCT player_access.id_player) FROM player_access WHERE id_plato = plato.id) as nbrPlayer FROM plato JOIN player_access ON player_access.id_plato = plato.id WHERE end = 0 AND player_access.id_player = ? GROUP BY plato.id";
  db.all(SQL, req.headers.authorization.split(" ")[2], (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send();
    } else {
      data.map(
        (row) =>
          (row.plato = row.plato
            .replaceAll("0", "X")
            .replaceAll("1", "O")
            .split(" ")
            .map((el) => el.split("")))
      );
      res.status(200).json(data);
    }
  });
};

exports.getGame = (req, res, next) => {
  const sql =
    "SELECT DISTINCT plato.plato AS plato, plato.id, plato.name, plato.turn, plato.end,player_access.id_player AS userId, player_access.team, users.name AS userName, users.sign as sign FROM plato LEFT JOIN player_access ON player_access.id_plato = plato.id JOIN users ON users.id = player_access.id_player WHERE plato.id = ? ORDER BY team";
  db.all(sql, req.params.id, (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: err });
    } else if (data.length > 0) {
      let value = {
        name: data[0].name,
        plato: data[0].plato.split(" ").map((el) => el.split("")),
        turn: data[0].turn,
        end: data[0].end,
        users: [],
      };

      data.map((el) => {
        const val = {
          id: el.userId,
          team: el.team,
          name: el.userName,
          sign: el.sign,
        };
        value.users.push(val);
      });
      if (data.length < 2) {
        value.users.push({ id: 0,team: 1,name: "", sign: 1 });
      }
      console.log(value)
      res.status(200).json(value);
    } else {
      res.status(400).json({ error: "Partie non existante" });
    }
  });
};

exports.getUsersGame = (req, res) => {
  const sql = "SELECT users.id as id, player_access.team as team, users.name as name, users.sign as sign FROM player_access LEFT JOIN users ON users.id = player_access.id_player WHERE id_plato = ?";

  db.all(sql,req.params.id, (err, data) => {
    if(err){
      console.error(err);
      res.status(500).json({ error: err});
    }else{
      console.log(data)
      res.status(400).json({users : data});
    }
  });

}
