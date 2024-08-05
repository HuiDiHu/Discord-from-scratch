const express = require('express')
const router = express.Router()

const { verifyServerOwnership } = require('../controllers/verifyChannelAccess')

const {
    createSingleServer,
    getServerMembers,
    generateInviteToken,
    joinServer, leaveServer
} = require('../controllers/servers')

router.route('/create').post(createSingleServer)
router.route('/members/:id').get(getServerMembers)
router.route('/token/:id').get(verifyServerOwnership, generateInviteToken)
router.route('/join/:id').put(joinServer)
router.route('/leave/:id').put(leaveServer)

module.exports = router