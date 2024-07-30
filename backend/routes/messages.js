const express = require('express')
const router = express.Router()
const { verifyDMAccess, verifyServerAccess } = require('../controllers/verifyChannelAccess')

const {
    getSingleDMMessages,
    getSingleChannelMessages
} = require('../controllers/messages')

router.route('/channels/@me/:id').get(verifyDMAccess, getSingleDMMessages)
router.route('/channels/:id').get(verifyServerAccess, getSingleChannelMessages)

module.exports = router;