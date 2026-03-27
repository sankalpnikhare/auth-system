const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

function authOrToken(req, res, next) {

    if (req.isAuthenticated && req.isAuthenticated()) {
        return next(); // Passport session login
    }

    const token = req.cookies.token;
    if (token) {
        try {
            const data = jwt.verify(token, process.env.JWT_SECRET_KEY);
            req.user = data;
            return next(); // JWT login
        } catch (err) {
            return res.send("Invalid Token");
        }
    }

    res.send("Please login first");
}

module.exports = authOrToken ; 