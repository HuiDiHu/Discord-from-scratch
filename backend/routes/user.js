const express = require('express')
const router = express.Router()

const {
    getMultipleUsers,
    deleteFriend
} = require('../controllers/user')

router.route('/multiple').post(getMultipleUsers)
router.route('/unfriend/:id').delete(deleteFriend)

module.exports = router