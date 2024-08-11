const jwt = require('jsonwebtoken')

const jwtSign = (payload, secret, options) => new Promise((resolve, reject) => {
    jwt.sign(payload, secret, options, (err, token) => {
        if (err) reject(err);
        resolve(token);
    });
});

const jwtVerify = (token, secret) => new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
        if (err) reject(err);
        resolve(decoded);
    });
});

const getJwt = (req) => {
    if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ") || req.headers.authorization === "Bearer null") {
        return null;
    }
    return req.headers.authorization.split(" ")[1];
}

module.exports = {
    jwtSign,
    jwtVerify,
    getJwt
}