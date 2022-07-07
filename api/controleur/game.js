const db = require("../../database/data");

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
    "SELECT COUNT(id) as nbrPlace, id_player as player FROM player_access WHERE id_plato = ?";
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
  const sql =
    "INSERT INTO player_access(id_plato,id_player,team) VALUES(?,?,?)";
  const values = [req.params.id, req.headers.authorization.split(" ")[2], 1];

  db.run(sql, values, (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send();
    } else {
      res.status(200).json({ msg: "Add access to player" });
    }
  });
};

exports.getAllGames = (req, res, next) => {
  const SQL =
    "SELECT plato.id as id, plato.name as name, plato.plato as plato,COUNT(player_access.id) as nbrPlayer FROM plato JOIN player_access ON player_access.id_plato = plato.id WHERE end = 0 GROUP BY plato.id";
  db.all(SQL, (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send();
    } else {
      data.map(
        (row) => (row.plato = row.plato.split(" ").map((el) => el.split("")))
      );
      res.status(200).json(data);
    }
  });
}; 

exports.getGame = (req, res, next) => {
  const sql =
    "SELECT plato.plato AS plato, plato.id, plato.name, plato.turn, plato.end,player_access.id_player AS userId, player_access.team, users.name AS userName FROM plato LEFT JOIN player_access ON player_access.id_plato = plato.id JOIN users ON users.id = player_access.id_player WHERE plato.id = ?";
  db.all(sql, req.params.id, (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: err });
    } else if (data.length > 0) {
      let value = {
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
        };
        value.users.push(val);
      });
      if (data.length < 2) {
        value.users.push({ name: "", team: 1 });
      }
      res.status(200).json(value);
    } else {
      res.status(400).send();
    }
  });
};
