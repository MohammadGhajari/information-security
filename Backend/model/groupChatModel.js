const mongoose = require('mongoose');

const groupChatSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'user should have a username'],
      unique: [true, 'username shouled be unique'],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Suser',
      required: true,
    },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Suser' }],
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

groupChatSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'users',
    select: 'username publicKey',
  });
  next();
});

const GroupChat = mongoose.model('SgroupChat', groupChatSchema);

module.exports = GroupChat;
