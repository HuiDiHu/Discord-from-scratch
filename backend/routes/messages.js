const express = require('express')
const router = express.Router()
const { verifyDMAccess } = require('../controllers/verifyChannelAccess')

const {
    getSingleDMMessages
} = require('../controllers/messages')

router.route('/channels/@me/:id').get(verifyDMAccess, getSingleDMMessages)

module.exports = router;