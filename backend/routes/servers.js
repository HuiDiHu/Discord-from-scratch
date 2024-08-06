const express = require('express')
const router = express.Router()
const { upload } = require('../multer');

const { verifyServerOwnership } = require('../controllers/verifyChannelAccess')

const {
    createSingleServer,
    getServerMembers,
    generateInviteToken,
    joinServer, leaveServer,
    uploadServerIcon
} = require('../controllers/servers')

router.route('/create').post(createSingleServer)
router.route('/members/:id').get(getServerMembers)
router.route('/token/:id').get(verifyServerOwnership, generateInviteToken)
router.route('/join/:id').put(joinServer)
router.route('/leave/:id').put(leaveServer)
router.route('/icon/upload/:id').put(verifyServerOwnership, upload.single('image'), uploadServerIcon)

module.exports = router