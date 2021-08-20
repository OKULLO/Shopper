const express = require('express');

const auth = require('../controllers/auth');

// const router = express.Router();

const { protect } = require('../middlewares/auth');



module.exports = (route)=>{ 
  
      route.post('/auth/register', auth.register);
      route.post('/auth/login', auth.login);
      route.get('/auth/logout', auth.logout);
      route.get('/auth/me', protect, auth.getMe);
      route.put('/auth/updatedetails', protect, auth.updateDetails);
      route.put('/auth/updatepassword', protect, auth.updatePassword);
      route.post('/auth/forgotpassword', auth.forgotPassword);
      route.put('/auth/resetpassword/:resettoken', auth.resetPassword);


 }