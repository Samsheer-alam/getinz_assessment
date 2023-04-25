const jwt = require("jsonwebtoken");
verifyToken = (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization'];

    if (!token) {
        return res.status(401).send({ message: "No token provided!" });
    }
    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }
    
    return jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
        if (err) {
            return res.status(401).send({ message: "Unauthorized!" });
        } else {
            req.user = payload.user;
            next();
        }
    });
};

const Auth = { verifyToken };

module.exports = Auth;