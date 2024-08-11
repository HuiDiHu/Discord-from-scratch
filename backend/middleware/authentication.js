const { StatusCodes } = require('http-status-codes')
const { jwtVerify } =  require("../controllers/jwt/jwtAuth");
const { UnauthenticatedError } = require('../errors');

const auth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        throw new UnauthenticatedError('Authentication invalid');
    }
    const token = authHeader.split(' ')[1] //get rid of Bearer
    if (!token) throw new UnauthenticatedError('Authentication invalid');

    jwtVerify(token, process.env.JWT_SECRET)
        .then((decoded) => {
            req.user = decoded;
            next();
        })
        .catch(error => {
            //console.log(error)
            res.status(StatusCodes.OK).json({ loggedIn: false });
        })
}

module.exports = auth;