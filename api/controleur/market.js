const db = require("../../database/data");

exports.getAllSkin = (req, res) => {
    const SQL = "SELECT * FROM sign"
    db.all(SQL, (err, data) => {
        if(err){
            console.error(err);
            res.status(500).json({error: err.message});
        }
        res.status(200).json(data);
    })
}
exports.setSign = (req, res) => {
    const SQL = "UPDATE users SET sign = ? WHERE id = ?";
    db.run(SQL, [req.params.id,req.headers.authorization.split(' ')[2]],(err, data) => {
        if(err){
            console.error(err);
            res.status(500).json({error: err.message});
        }
        res.status(200).json({msg: "Success!"});
    })
}