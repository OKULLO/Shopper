
const conn = require('../config/dbConfig')
const bcrypt = require('bcryptjs');
const crypto = require('crypto')
const jwt = require('jsonwebtoken');


const self = {}

//check for existing id in params obj
self.check_params = (obj)=>{
     for(const val in obj){
        if(obj.hasOwnProperty(val)){
            return true

        }
        return false
     }
     
}


self.generate_id =()=>{
    const shortid = require('short-uuid');
    return shortid.generate()
    
}

// --------------------Encrypt password using bcrypt
self.password_hash = async (passwordtohash)=>{

     const salt = await bcrypt.genSalt(10);
     return  bcrypt.hash(passwordtohash, salt);
}


self.comparePassword = async (passtocompare,hashvalue)=>{
    return await bcrypt.compare(passtocompare,hashvalue)
}

// Sign JWT and return
self.getSignedJwtToken = (user_id)=> {
  return jwt.sign({ id: user_id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};


// Generate and hash password token
self.getResetPasswordToken = (user)=> {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  user.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};



module.exports = self



