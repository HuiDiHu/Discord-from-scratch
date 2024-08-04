const express = require('express')
const router = express.Router()

const {
    getMultipleUsers
} = require('../controllers/user')

router.route('/multiple').post(getMultipleUsers)

module.exports = router