const { StatusCodes } = require('http-status-codes')
const pool = require('../db/connect')

const createSingleServer = async (req, res) => {
    const { serverName } = req.body;
    if (!serverName) res.status(StatusCodes.UNPROCESSABLE_ENTITY).send('Server name cannot be empty!');
    if (serverName.length > 50) res.status(StatusCodes.UNPROCESSABLE_ENTITY).send('Server name too long!');

    

    res.status(StatusCodes.CREATED).send('Created single server')
}

module.exports = {
    createSingleServer
}