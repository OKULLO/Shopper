const { Router } = require('express')
const auth = Router();

const { RegisterUser,LoginUser } = require('../../controllers/auth')
const { validation } = require('../../middlewares/middleware');

auth
  .route('/register')
   .post(validation.validateRegister,RegisterUser)

auth
   .route('/login')
   .post(LoginUser)

module.exports = auth;
