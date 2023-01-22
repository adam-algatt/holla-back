const express = require('express'); 

const { getAllMessages, sendMessage } = require('../controllers/messageControllers')
const { protect } = require('../middleware/authMiddleware')
const router = express.Router();

router.route("/:chatId").get(protect, getAllMessages);
router.route("/").post(protect, sendMessage);

module.exports = router;

