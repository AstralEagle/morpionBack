const db = require('../../database/data');

exports.getUserInfo = (req, res, next) => {
    const sql = "SELECT COUNT(plato.id) as point,users.name FROM plato LEFT JOIN player_access ON player_access.id_plato = plato.id LEFT JOIN users ON users.id = player_access.id_player WHERE plato.end = 1 AND player_access.team = plato.turn AND player_access.id_player = ?"
    db.each(sql, req.params.id, (err, data) => {
        if(err){
            console.error(err);
            res.status(500).json({error: err})
        }else{
            res.status(200).json(data)
        }
    })

}
exports.getListPoints = (req, res, next) => {
    const sql = "SELECT users.id, users.name, COUNT( DISTINCT plato.id) AS point FROM users LEFT JOIN player_access ON player_access.id_player = users.id LEFT JOIN plato ON plato.id = player_access.id_plato WHERE plato.end = 1 AND player_access.team = plato.turn GROUP BY users.id ORDER BY Point DESC"
    db.all(sql, (err, data) => {
        if(err){
            console.error(err);
            res.status(500).json({error: err})
        }else{
            res.status(200).json(data)
        }
    })
}
