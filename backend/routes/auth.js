const express = require('express')
const router = express.Router()

const {
    register,
    login,
    verifyLogin
} = require('../controllers/auth')

router.route('/login').get(verifyLogin).post(login)
router.route('/register').post(register)

module.exports = router;