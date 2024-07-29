const express = require('express')
const router = express.Router()

const {
    getAllChannelsAndMembersWithServerId
} = require('../controllers/channels')

router.route('/server/:id').get(getAllChannelsAndMembersWithServerId)

module.exports = router