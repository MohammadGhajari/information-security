const express = require('express');
const {
  getUser,
  createUser,
  getAllUsers,
  deleteUser,
  updateUser,
  getMe,
  updateMe,
  deleteMe,
  uploadUserPhoto,
} = require('./../controller/userController');
const {
  signUp,
  protect,
  login,
  logout,
  resetPassword,
} = require('./../controller/authController');

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);
router.get('/logout', logout);

router.get('/me', getMe, getUser);
router.route('/updateMe').patch(updateMe);
router.route('/deleteMe').delete(deleteMe, deleteUser);
router.route('/:id').get(getUser).delete(deleteUser).patch(updateUser);
router.route('/').post(createUser).get(getAllUsers);

module.exports = router;
