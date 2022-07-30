const jwt = require('jsonwebtoken')

const db = require('../../database/data');



exports.signup = (req, res, next) => {
    const sql = "INSERT INTO users(email,name,mdp) VALUES(?,?,?)";
    const values = [req.body.email, req.body.name, req.body.mdp]
    
    db.run(sql, values,(err,data) => {
        if(err){
            console.error(err);
            res.status(500).send();
        }
        else{
            res.status(200).json({msg : "Success"});
        }
    })
}


exports.login = (req,res) => {


    console.log(req.body);
    const sql = "SELECT * FROM users WHERE email = ?"
    db.all( sql, req.body.email, (err,data) => {
        if(err){
            console.error(err);
            res.status(500).send();
        }
        if(data.length < 1 ){
            res.status(400).json({error : "Email inccorect"})
        }
        else{
            const user = data[0]
            if(user.mdp == req.body.mdp){
                if(user.save === true){
                    res.status(200).json({
                        userID : user.id,
                        token : jwt.sign({userID : user.id},process.env.TOKENUSER),
                    });
                }else{
                    res.status(200).json({
                        userID : user.id,
                        token : jwt.sign({userID : user.id},process.env.TOKENUSER,{expiresIn: "12h"}),
                    });
                }
                }else{
                res.status(400).json({error : "Mot de passe inccorect"})
            }
        }
    })
}

exports.auth = (req,res) => {
    const SQL = "SELECT id,name FROM users WHERE id = ?"
    db.all( SQL, req.headers.authorization.split(" ")[2], (err,data) => {
        if(err){
            console.error(err);
            res.status(500).json({error : "Serveur Error"});
        }else if(data.length == 0){
            res.status(400).json({logOut : true, error : "Utilisateur introuvable"})
        }else{
            res.status(200).json(data[0])
        }
    })
}
