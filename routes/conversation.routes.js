const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversation.controller');

router.post('/', conversationController.createConversation);
router.get('/', conversationController.getAllConversations);
router.get('/:id', conversationController.getConversationById);
router.put('/:id', conversationController.updateConversation);
router.delete('/:id', conversationController.deleteConversation);

module.exports = router;