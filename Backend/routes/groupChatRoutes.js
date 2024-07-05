const express = require('express');
const {
  getGroupChat,
  getAllGroupChats,
  createGroupChat,
  deleteGroupChat,
  updateGroupChat,
} = require('./../controller/groupChatController');

const router = express.Router();

router
  .route('/:id')
  .get(getGroupChat)
  .delete(deleteGroupChat)
  .patch(updateGroupChat);
router.route('/').post(createGroupChat).get(getAllGroupChats);

module.exports = router;
