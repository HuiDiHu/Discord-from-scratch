const express = require('express')
const router = express.Router()

const { verifyServerOwnership } = require('../controllers/verifyChannelAccess')

const {
    getAllChannelsAndMembersWithServerId,
    createSingleChannelWithServerId
} = require('../controllers/channels')

router.route('/server/:id').get(getAllChannelsAndMembersWithServerId)
router.route('/add').post(verifyServerOwnership, createSingleChannelWithServerId)

module.exports = router