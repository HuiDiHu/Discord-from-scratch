const express = require('express')
const router = express.Router()
const { upload } = require('../multer')

const {
    getMultipleUsers,
    deleteFriend,
    uploadProfilePicture
} = require('../controllers/user')

router.route('/multiple').post(getMultipleUsers)
router.route('/unfriend/:id').delete(deleteFriend)
router.route('/profilePicture/upload/:id').put(upload.single('image'), uploadProfilePicture)

module.exports = router