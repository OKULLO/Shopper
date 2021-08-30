const express = require('express');

const auth = require('../controllers/auth');

// const router = express.Router();

const { protect } = require('../middlewares/auth');



module.exports = (route)=>{ 
  
      route.post('/api/v1/auth/register', auth.register);
      route.post('/api/v1/auth/login', auth.login);
      route.get('/api/v1/auth/logout', auth.logout);
      route.get('/api/v1/auth/me', protect, auth.getMe);
      route.put('/api/v1/auth/updatedetails', protect, auth.updateDetails);
      route.put('/api/auth/updatepassword', protect, auth.updatePassword);
      route.post('/api/v1/auth/forgotpassword', auth.forgotPassword);
      route.put('/api/v1/auth/resetpassword/:resettoken', auth.resetPassword);


 }