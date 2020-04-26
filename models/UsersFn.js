const conn = require('../config/dbConfig');
const  fn  = require('./functions');

function getUserById(Id,type){
  return new Promise((resolve,reject)=>{
       conn.query(`SELECT * from client WHERE id = ${fn.sql_escape(Id)}
       AND usertype =${fn.sql_escape(type)};`, [Id],(err,row)=>{
         if(err){
           reject(err)
         }
         else{
           resolve(row)
         }
       });

  })
}

  // get client by username
function getUsers(type){
  return new Promise((resolve,reject)=>{
      const qs =`SELECT * FROM client where usertype =${fn.sql_escape(type)};`
      conn.query(qs, [],(err,rows)=>{
        if(err){
          reject(err)
        }
        else{
          resolve(rows)
        }
      });
    })
  }

/*
    conn.query(`INSERT into client(name,contacts,email,address,gender,user_dob,nationality,user_NIN,usertype,user_idnum,User_account_id) 
      VALUES(${fn.sql_escape(name)},${fn.sql_escape(contacts)},
        ${fn.sql_escape(email)},${fn.sql_escape(address)},${fn.sql_escape(gender)},
        ${fn.sql_escape(dob)},${fn.sql_escape(nationality)},${fn.sql_escape(user_NIN)},
        ${fn.sql_escape(type)},${fn.sql_escape(idnum)},'${account_id}')`
        */

//adding user info
function InsertInfo( name,contacts,email,address,gender,dob,nationality,user_NIN,type,idnum){

    return new Promise((resolve,reject)=>{
      const account_id = fn.getId(email);
conn.query(`INSERT INTO client SET name =${fn.sql_escape(name)},contacts=${fn.sql_escape(contacts)},
        email =${fn.sql_escape(email)},address=${fn.sql_escape(address)},gender =${fn.sql_escape(gender)},
        user_dob =${fn.sql_escape(dob)},nationality=${fn.sql_escape(nationality)},user_NIN =${fn.sql_escape(user_NIN)},
        usertype =${fn.sql_escape(type)},user_idnum=${fn.sql_escape(idnum)},User_account_id= (SELECT id FROM User_account WHERE User_email =${fn.sql_escape(email)})`,[ name,contacts,email,address,gender,dob,nationality,user_NIN,type,idnum,account_id],
        (err,results)=>{
          if(err){
            reject(err)
          }
          resolve(results)
        })
     })

  }

function updateInfo(id,type,name,contacts,email,address,gender,dob,nationality,user_NIN){
      return new Promise((resolve,reject)=>{
        conn.query(`UPDATE client SET name =${fn.sql_escape(name)},contacts=${fn.sql_escape(contacts)},
        email =${fn.sql_escape(email)},address=${fn.sql_escape(address)},gender =${fn.sql_escape(gender)},
        user_dob =${fn.sql_escape(dob)},nationality=${fn.sql_escape(nationality)},user_NIN =${fn.sql_escape(user_NIN)} WHERE
        usertype =${fn.sql_escape(type)} AND id =${id};`,
      (err,results)=>{
        if(err){
          reject(err)
        }
        resolve(results)
      })
      })
    }

function deleteInfo(Id,usertype){
    return new Promise((resolve, reject)=>{
      conn.query(`DELETE FROM client WHERE id ='${Id}' AND usertype ='${usertype}'`,(err,info)=>{
        if(err){
          reject(err)
        }
        resolve(info)
      })
    })
}

function checkUser(mail, user) {
  const query = 'SELECT * FROM User_account WHERE email = ? OR Username = ?'

  return new Promise((resolve, reject) => {
    conN.query(query, [mail, user], (err, row, fields) => {
      if (err) {
        reject(err)
      }
      if (row.length > 0) {
        resolve(true)
      } else {
        resolve(false)
      }
    })
  })
}

module.exports = {
  getUsers,
  getUserById,
  InsertInfo,
  updateInfo,
  deleteInfo

}
