const express = require('express')
const router = express.Router()

const { verifyServerOwnership } = require('../controllers/verifyChannelAccess')

const {
    createSingleServer,
    getServerMembers,
    generateInviteToken,
    joinServer
} = require('../controllers/servers')

router.route('/create').post(createSingleServer)
router.route('/members/:id').get(getServerMembers)
router.route('/token').get(verifyServerOwnership, generateInviteToken)
router.route('/join/:id').put(joinServer)

module.exports = router