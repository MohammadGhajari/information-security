const catchAsync = require('./../utils/catAsync');
const AppError = require('./../utils/appError');
const User = require('./../model/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires:
      new Date().now + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    httpOnly: true,
  };

  res.cookie('jwt', token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  createSendToken(newUser, 201, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  console.log('proteeeeeeeeeeeeeeeeect');
  console.log(req.cookies.jwt);

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token)
    return next(new AppError('you are not logged in. please try again.', 401));

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const currentUser = await User.findById(decoded.id);

  req.user = currentUser;
  res.locals.user = currentUser;

  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401,
      ),
    );
  }

  next();
});

exports.login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password)
    return next(new AppError('please provide username and password', 400));

  const user = await User.findOne({ username }).select('+password');
  if (!user) return next(new AppError('incurrect username or password', 401));

  const candidateHash = await bcrypt.hash(password, user.salt);

  if (user.password !== candidateHash) {
    return next(new AppError('incorrect username or password', 401));
  }

  createSendToken(user, 200, res);
});

exports.logout = (req, res, next) => {
  res.cookie('jwt', 'logged out', {
    expires: new Date(Date.now() + 100 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    status: 'success',
  });
};
const hashLength = 12;
exports.resetPassword = catchAsync(async (req, res, next) => {
  const { password, newPassword, passwordConfirm } = req.body;
  const email = req.user.email;

  const user = await User.findOne({ email }).select('+password');

  if (newPassword !== passwordConfirm)
    return next(
      new AppError('new password and password confirm must be the same.', 401),
    );

  if (!(await bcrypt.compare(password, user.password))) {
    return next(new AppError('current password is wrong.', 401));
  }
  const hashedPassword = await bcrypt.hash(newPassword, hashLength);
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    { password: hashedPassword },
    {
      new: true,
      runValidators: true,
    },
  );

  res.status(200).json({
    status: 'success',
    data: {
      updatedUser,
    },
  });
});
