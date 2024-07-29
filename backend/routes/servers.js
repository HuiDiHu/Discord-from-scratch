const express = require('express')
const router = express.Router()

const {
    createSingleServer
} = require('../controllers/servers')

router.route('/create').post(createSingleServer)

module.exports = router