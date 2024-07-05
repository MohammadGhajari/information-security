const GroupChat = require('./../model/groupChatModel');
const {
  getOne,
  createOne,
  getAll,
  deleteOne,
  updateOne,
} = require('./handleFactory');

exports.getGroupChat = getOne(GroupChat);
exports.createGroupChat = createOne(GroupChat);
exports.getAllGroupChats = getAll(GroupChat);
exports.deleteGroupChat = deleteOne(GroupChat);
exports.updateGroupChat = updateOne(GroupChat);
