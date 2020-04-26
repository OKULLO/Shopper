
const clients = require('../models/clientFns');
const conn = require('../config/dbConfig');
const fn = require('../models/functions')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const self = {}

/**
*Route /api/client/:id
*edit client
*/
self.updateAdmin = (req,res, next)=>{}

/**
*Route /api/client/:id
@get single client

*/
self.getAdminDetails = (req,res ,next)=>{
  const id = req.params.id;
  const qs ="SELECT * FROM client where id =? AND usertype =admin"
  conn.query(qs,[id],(err,rows)=>{
    if(err){
      return res.status(400).json({
        success:false,
        error:err
      })
    }
    else{
      return res.status(200).json({
        success:true,
        count:rows.length,
        client:rows[0][0],
      })
    }
  })
  next()
}

/*------------------------------------
*Route /api/admin/:id
*get edit
*@delete
--------------------------------------------*/
self.del_admin_info =  (req, res, next) =>{
  const id = req.params.id;
  const qs =`SELECT * FROM client where id = ${fn.sql_escape(req.params.id)}`;
  conn.query(qs,[id],(err,info)=>{
     if(err){
       return res.status(401).json({
         success:false,
         error:error
       })
       return res.status(200).json({
         success:true,
         data:{}
       })
     }
  })
  next()
}
/**------------------------------------------------
*Route /api/client/:id
@get client properties
----------------------------------------*/


module.exports = self;
