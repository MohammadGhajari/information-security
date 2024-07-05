const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const crypto = require('crypto');
const NodeRSA = require('node-rsa');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'user should have a username'],
      unique: [true, 'username shouled be unique'],
    },
    email: {
      type: String,
      required: [true, 'user should have an email'],
      validate: [validator.isEmail, 'please provide a valid email'],
      unique: [true, 'email should be unique'],
    },
    password: {
      type: String,
      required: [true, 'user should have a password'],
      minLength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'user should have a password confirm'],
      select: false,
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: 'passwords are not the same',
      },
    },
    salt: {
      type: String,
    },
    publicKey: { type: String, unique: true },
    privateKey: { type: String, unique: true },
    // groups: [{ type: String }],
    role: {
      type: String,
      enum: ['user', 'group', 'admin'],
      default: 'user',
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

userSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.salt = salt;

  this.password = await bcrypt.hash(this.password, salt);
  this.passwordConfirm = undefined;

  const key = new NodeRSA({ b: 512 });

  const publicKey = key.exportKey('private');
  const privateKey = key.exportKey('public');

  this.publicKey = publicKey;
  this.privateKey = privateKey;

  next();
});

const User = mongoose.model('Suser', userSchema);

module.exports = User;
