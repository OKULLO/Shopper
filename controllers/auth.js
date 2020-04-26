const conn = require('../config/dbConfig');
const fn = require('../models/functions')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const self = {}

//register a client
self.RegisterUser = (req, res, next)=>{
  //const { username,email,pasword } = req.body;
  conn.query(
    `SELECT * FROM User_account WHERE Username = ${fn.sql_escape(req.body.username)} AND User_email =${fn.sql_escape(req.body.email)};`,
    (err, result) => {
      if (result.length) {
        return res.status(409).send({
          msg: 'Username is already in use!'
        });
      }
       else {
        // username is available
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).send({
              msg: err
            });
          } else {
            // has hashed pw => add to database
            const sql =`INSERT INTO User_account(Username, password,User_email)
             VALUES (${fn.sql_escape(req.body.username)},
            ${fn.sql_escape(hash)},${fn.sql_escape(req.body.email)})`
            conn.query(sql,
              (err, result) => {
                if (err) {
                  throw err;
                  return res.status(400).send({
                    msg: err
                  });
                }
                return res.status(201).json({
                  success:true,
                  data:result,
                  msg: 'Registered!'
                });
              }
            );
          }
        });
      }
    }
  );
}
self.LoginUser =(req,res,next)=>{
  conn.query(
    `SELECT * FROM User_account WHERE User_email = ${fn.sql_escape(req.body.email)};`,
    (err, result) => {
      // user does not exists
      if (err) {
        return res.status(400).send({
          msg: err
        });
      }
      if (!result.length) {
        return res.status(401).json({
          success:false,
          msg: 'Account not found! Please register to login'
        });
      }
      // check password
      bcrypt.compare(
        req.body.password,
        result[0]['password'],
        (bErr, bResult) => {
          // wrong password
          if (bErr) {
            return res.status(401).send({
              msg: 'Email or password is incorrect!'
            });
          }
          if (bResult) {
            const token = jwt.sign({
                username: result[0].username,
                userId: result[0].id
              },
              'Sc34RE', {
                expiresIn: '7d'
              }
            );
            return res.status(200).send({
              msg: 'Logged in!',
              token,
              user: result[0]
            });
          }
          return res.status(401).send({
            msg: 'Username or password is incorrect!'
          });
        }
      );
    }
  );
}

module.exports = self;
