const crypto = require('crypto');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
// const sendEmail = require('../utils/sendEmail');
const { User }= require('../database/models');
const func = require('../helpers/functions');
const util = require('../utils')

const log = util.Logger

const auth = {}

// @desc      Register user
// @route     POST /api/v1/auth/register
// @access    Public
auth.register = asyncHandler(async (req, res, next) => {
      const { username, email, contact, password } = req.body;
       // #hash the user password
      

      try{
       const usr = await User.findOne({where: {email:email}})
        // --------------------------------------Create user
        if(!usr){

          const hash = await func.password_hash(password)

           await User.create({
                username:username,
                email:email,
                contact:contact,
                password:hash
                
                  // role
                });


               return res.status(201).json({
                  success:true,
                  message:'user created'
                })

            

        }else{
          return res.status(403).json({
            success:false,
            error:'user already exists'
          })
        }
        
    }catch(e){
        return res.status(500).json({
          success:false,
          error:e
        })

    }
});

// @desc      Login user
// @route     POST /api/v1/auth/login
// @access    Public
auth.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // --------------------------------Validate emil & password
  if (!email || !password) {
    // return next(new ErrorResponse('Please provide an email and password', 400));
    // return res.status(400).json({error:"Please provide an email and password"})
    return res.json({error:"Please provide an email and password"})
  }

  // -----------------------------------------------Check for user
  const user = await User.findOne({ where:{email:email}});

  if (!user) {
    // return next(new ErrorResponse('Invalid credentials', 401));
    // return res.status(401).json({error:"Invalid credentials"})
    return res.json({error:"Invalid credentials"})
  }

  // -----------------------------------------Check if password matches
  const isMatch = await func.comparePassword(password,user.password);

  if (!isMatch) {
    // return next(new ErrorResponse('Invalid credentials', 401));
    // return res.status(401).json({error:"Invalid credentials"})
    return res.json({error:"Invalid credentials"})
  }

  sendTokenResponse(user, 200, res);
});

// @desc      Log user out / clear cookie
// @route     GET /api/v1/auth/logout
// @access    Private
auth.logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc      Get current logged in user
// @route     POST /api/v1/auth/me
// @access    Private
auth.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({
    where: {user_id: req.params.user_id }
  });

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc      Update user details
// @route     PUT /api/v1/auth/updatedetails
// @access    Private
auth.updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    username: req.body.username,
    email: req.body.email,
    contact:req.body.contact
  };

  // console.log(req.user)
  const user = await User.findOne({
    where :{ user_id: req.user.id }
  });

  if(user){
    await user.set(fieldsToUpdate)
    await user.save()

  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc      Update password
// @route     PUT /api/v1/auth/updatepassword
// @access    Private
auth.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({where:{user_id: req.user.id }})

  // Check current password
  if (!(await func.comparePassword(req.body.currentPassword,user.password))) {
     return res.status(401).json({error:'password is incorrect'})
  }

  user.password = req.body.newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// @desc      Forgot password
// @route     POST /api/v1/auth/forgotpassword
// @access    Public
auth.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ where:{email: req.body.email} });

  if (!user) {
    return res.status(404).json({success:false,error:'Email is incorrect'})
  }

  // Get reset token
  const token = func.getResetPasswordToken();
  user.resetPasswordToken = token.resetPasswordToken;
  user.resetPasswordExpire = token.resetPasswordExpire;

  await user.save();

  // Create reset url
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/resetpassword/${token.resetToken}`;

  const message = `You are receiving this email because you requested for password reset. Please click the link to reset password: \n\n ${resetUrl}`;

  try {
    await util.sendEmail({
      email: user.email,
      subject: 'Password reset token',
      message
    });

    res.status(200).json({ success: true, data: 'Email sent' });
  } catch (e) {
    log.error(e);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    // return next(new ErrorResponse('Email could not be sent', 500));
     return res.status(500).json({error:"Email could not be sent"})
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc      Reset password
// @route     PUT /api/v1/auth/resetpassword/:resettoken
// @access    Public
auth.resetPassword = asyncHandler(async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  const user = await User.findOne({
   where:{ 
       resetPasswordToken:resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
       } 
  });

  if (!user) {
    // return next(new ErrorResponse('Invalid token', 400));
     return res.status(400).json({error:"Invalid token"})
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = func.getSignedJwtToken(user);

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token
    });
};


module.exports = auth