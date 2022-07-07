const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const userID = parseInt(req.headers.authorization.split(" ")[2]);
    const decodedToken = jwt.verify(token, process.env.TOKENUSER);
    const verifiID = decodedToken.userID;
    if (
      (req.body.userID && parseInt(req.body.userID) !== verifiID) ||
      userID !== verifiID
    ) {
      throw "Invalid user ID";
    } else {
      next();
    }
  } catch {
    res.status(403).json({
      error: "Log out",
      logOut: true
    });
  }
};
