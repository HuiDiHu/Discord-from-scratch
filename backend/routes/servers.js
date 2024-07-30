const express = require('express')
const router = express.Router()

const {
    createSingleServer,
    getServerMembers
} = require('../controllers/servers')

router.route('/create').post(createSingleServer)
router.route('/members/:id').get(getServerMembers)

module.exports = router