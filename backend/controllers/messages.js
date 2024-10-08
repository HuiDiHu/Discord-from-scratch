const { StatusCodes } = require('http-status-codes')
const pool = require('../db/connect')

const getSingleDMMessages = async (req, res) => {
    const {
        params: { id: channelId }
    } = req;

    const messages = (await pool.query(
        "SELECT * FROM DM_MESSAGES WHERE in_dm = $1",
        [Number(channelId)]
    )).rows.sort((a, b) => b.created_at < a.created_at ? 1 : -1);
    res.status(StatusCodes.OK).json(messages)
}

const getSingleChannelMessages = async (req, res) => {
    const {
        params: { id: channel_id }
    } = req;
    
    const messages = (await pool.query(
        "SELECT * FROM CHANNEL_MESSAGES c WHERE c.in_channel = $1",
        [Number(channel_id)]
    )).rows.sort((a, b) => b.created_at < a.created_at ? 1 : -1);
    res.status(StatusCodes.OK).json(messages)
}

module.exports = {
    getSingleDMMessages,
    getSingleChannelMessages
}