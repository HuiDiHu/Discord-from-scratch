const multer = require('multer');

// Configure multer for file storage
const storage = multer.memoryStorage(); // or use diskStorage for file system storage
const upload = multer({ storage: storage });

module.exports = { upload };