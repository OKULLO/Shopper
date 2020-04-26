const conn = require('../config/dbConfig');
const cls = require('../models/UsersFn');
const shortid = require('short-uuid')

const self = {};



self.Register_user_info = async(req,res,next)=>{
          //const { name,contacts,email,address,gender,dob,nationality,user_NIN,usertype } = req.body;
             const type = req.body.type ;
             const name = req.body.name;
             const contacts = req.body.contacts;
             const userNIN = req.body.userNIN ;
             const gender = req.body.gender;
             const dob = req.body.dob;
             const nationality = req.body.nationality;
             const email = req.body.email;
             const address = req.body.address;
             const idnum = shortid.generate()
          let user;
          try{
     
             user = await cls.InsertInfo(name,contacts,email,address,gender,dob,nationality,userNIN,type,idnum);
            if(!user){
              return res.status(501).json({
                success:false,
                msg:'unsuccessfull'
              })
            }
            else{
              return res.status(201).json({
                success:true,
                row:user
              })
            }
          
          }
          catch(e){
            next(e)
          }
}
/**
*Route /api/client/
*@get single client
*/
self.getAllClients = async(req,res, next)=>{
    let clients;
       try{
         clients = await cls.getUsers('agent');
         return res.status(200).json({
           success:true,
           count:clients.length,
           data:clients

         })
       }
       catch(e){
         next(e)
       }
      }
/**
* Update new client
*
* The body may contain any of the valid attributes, with their new values. Attributes
* not included will be left unmodified.
*
* The new rev of the client will be returned if successful
*/
self.updateClient = async(req,res, next)=>{
          //const type = req.body.type || '';
          const name = req.body.name || '';
          const contacts = req.body.contacts || '';
          const userNIN = req.body.userNIN || '';
          const gender = req.body.gender || '';
          const dob = req.body.dob || '';
          const nationality = req.body.nationality || '';
          const email = req.body.email || '';
          const address = req.body.address || '';
    let updated;
          try {

            updated = await cls.updateInfo(req.params.id,'agent', name,contacts,email,address,gender,dob,nationality,userNIN)
             if(!updated){
               return res.json({
                 success:false,
                 msg:"update unsuccessfull"
               })
             }
             return res.status(201).json({
              success:true,
              data:updated
            });
          }catch(e){
            next(e)
          }
}

/**
*Route /api/client/:id
@return single client

*/
self.getSingleClient = async(req,res ,next)=>{
     const id = req.params.id;
     let client;
     try{
         client = await cls.getUserById(id,"agent");
         if(!client){
           return res.status(204).json({
             success:false,
             error:'client not found '
           })
          }else{
           return res.status(200).json({
             success:true,
             data:client
           })
         }
     }
     catch(e){
       next(e)
     }
   }

/*------------------------------------
*Route /api/client/:id
*get edit
*@delete
--------------------------------------------*/
self.del_client_info =  async(req, res, next) =>{
      const Id = req.params.id;
      try {
        const del =  await cls.deleteInfo(Id,"agent")
        return res.status(200).json({
          success:true,
          deleted:del.affectedRows
        })
      } catch (e) {
        return res.status(500).json({
          success:false,
          error:e
        })
      }
}

module.exports = self;
