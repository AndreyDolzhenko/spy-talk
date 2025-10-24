const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversation.controller');

router.post('/', conversationController.createConversation);
router.get('/', conversationController.getAllConversations);
router.get('/:user_id', conversationController.getConversationByUserId);
router.put('/:id', conversationController.updateConversation);
router.delete('/:user_id', conversationController.deleteConversation);

module.exports = router;