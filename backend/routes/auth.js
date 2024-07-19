const express = require('express')
const router = express.Router()
const validateForm = require('../controllers/validateForm')
const authRateLimiter = require('../controllers/authRateLimiter')

const {
    register,
    login,
    verifyLogin
} = require('../controllers/auth')


router.route('/login').get(verifyLogin).post(validateForm("login"), authRateLimiter(10, 60), login)
router.route('/register').post(validateForm("register"), authRateLimiter(3, 30), register)

module.exports = router;