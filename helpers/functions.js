
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
self.getSignedJwtToken = (user)=> {
  return jwt.sign({ id: user.user_id,role:user.role}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};


// Generate and hash password token
self.getResetPasswordToken = ()=> {
  const token ={}
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  token.resetToken

  // Hash token and set to resetPasswordToken field
  token.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire
  token.resetPasswordExpire = Date.now() + 10 * 60 * 1000;


  return token
};



module.exports = self



