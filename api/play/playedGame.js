const express = require("express");
const route = express.Router();

const db = require("../../database/data");

module.exports = (io) => {
  route.post("/:id", verifTurn, (req, res) => {
    const SQL = "SELECT plato, turn from plato WHERE id = ?";

    db.each(SQL, req.params.id, (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send();
      } else {
        let plato = data.plato.split(" ").map((el) => el.split(""));
        const pos = req.body.position.split("");
        if (plato[pos[0]][pos[1]] == ".") {
          let caseValue = ["X", 1];

          if (data.turn == 1) {
            caseValue = ["O", 0];
          }
          plato[pos[0]][pos[1]] = caseValue[0];
          const win = winCondition(plato);
          console.log("Win?", win);
          if (win == null) {
            const values = [
              plato.map((el) => el.join("")).join(" "),
              caseValue[1],
              req.params.id,
            ];

            db.run(
              "UPDATE plato SET plato = ?, turn = ? WHERE id = ?",
              values,
              (err) => {
                io.to(`morpion${req.params.id}`).emit("played", {
                  plato: plato,
                  turn: caseValue[1],
                });
                res.status(200).json({ msg: "Success" });
              }
            );
          } else if (win){
            const values = [
              plato.map((el) => el.join("")).join(" "),
              req.params.id,
            ];
            db.run(
              "UPDATE plato SET plato = ?, end = 1 WHERE id = ?",
              values,
              (err) => {
                if (err) {
                  console.error(err);
                  res.status(500).json({ error: err });
                } else {
                  io.to(`morpion${req.params.id}`).emit("gamefinish", {
                    plato: plato,
                    end: 1,
                  });
                  res.status(200).json({ msg: "WP" });
                }
              }
            );
          }
          else if (!win){
            console.log("reset match")
            const resetValue = ["... ... ...",caseValue[1],req.params.id]
            db.run("UPDATE plato SET plato = ? , turn = ? WHERE id = ?", resetValue, (err) => {
              if(err){
                console.error(err);
                res.status(500).json({ error: err})
              }else  {
                io.to(`morpion${req.params.id}`).emit("played", {
                  plato: [[".",".","."],[".",".","."],[".",".","."]],
                  turn: caseValue[1],
                });
                res.status(200).json({ msg: "Success" });
              }
            })
          }
        }
      }
    });
  });
  return route;
};

const verifTurn = (req, res, next) => {
  const SQL = "SELECT turn, end FROM plato WHERE id = ?";
  db.each(SQL, req.params.id, (err, platoData) => {
    if (err) {
      console.log(err);
      res.status(500).send();
    } else if (platoData.end === 1) {
      res.status(400).json({ error: "La partie est fini!" });
    } else {
      const turn = platoData.turn;
      const sql =
        "SELECT team FROM player_access WHERE id_plato = ? AND id_player = ?";
      const value = [req.params.id, req.headers.authorization.split(" ")[2]];

      db.each(sql, value, (err, data) => {
        if (err) {
          console.log(err);
          res.status(500).send();
        } else {
          if (turn == data.team) {
            next();
          } else {
            res.status(400).json({ error: "It's not your turn!" });
          }
        }
      });
    }
  });
};

const winCondition = (tab) => {
  let condition = false;
  let mNull = false;

  for (let i = 0; i < tab.length; i++) {
    if (
      tab[i][0] === tab[i][1] &&
      tab[i][1] === tab[i][2] &&
      tab[i][2] !== "."
    ) {
      mNull = true;
      break;
    } else if (tab[i][0] === "." || tab[i][1] === "." || tab[i][2] === ".") {
      condition = true;
    }
  }
  if (!mNull) {
    for (let i = 0; i < 3; i++) {
      if (
        tab[0][i] === tab[1][i] &&
        tab[0][i] === tab[2][i] &&
        tab[0][i] !== "."
      ) {
        mNull = true;

        break;
      }
    }
  }
  if (!mNull) {
    if (tab[0][0] == tab[1][1] && tab[0][0] == tab[2][2] && tab[0][0] != ".") {
      mNull = true;
    } else if (
      tab[0][2] == tab[1][1] &&
      tab[0][2] == tab[2][0] &&
      tab[0][2] != "."
    ) {
      mNull = true;
    }
  }
  if (mNull) return true;
  else if (condition) return null;
  else return false;
};
