const jwt = require('jsonwebtoken');
const asyncHandler = require('../middlewares/async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../database/models/user');

const auth = {}
// Protect routes
auth.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
    // Set token from cookie
    // console.log(token)
  }
  // else if (req.cookies.token) {
  //   token = req.cookies.token;
  // }

  // Make sure token exists
  if (!token) {
     return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = decoded

      next();
  } catch (e) {
     // return next(new ErrorResponse('Not authorized to access this route', 401));
     return res.status(500).json(e)
  }
});

// Grant access to specific roles
auth.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};


module.exports = auth