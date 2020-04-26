
const conn = require('../config/dbConfig');
const fn = require('../models/functions')



//get all property
exports.listProps =(cb) =>{
  const qs =`SELECT p.property_name,p.PropertyPrice,p.PropertAddress,p.description,pp.type ,c.propertyCategory,l.areaName FROM Property p 
  INNER JOIN property_type pp ON p.propertytype = pp.typeid 
  INNER JOIN propertyCategory c ON p.category =c.id
  INNER JOIN LocationArea l ON p.area = l.area_id ORDER BY p.id DESC LIMIT 4`
       conn.query(qs,[],(err,results)=>{
        if(err)
         return cb(err)
        return cb(null,results)
       })   
}


//get by id 
exports.getById =(Id,tbl,cb)=>{
      conn.query(`SELECT * FROM ${tbl} WHERE id =${fn.sql_escape(Id)}`, [Id,tbl],(err, rows)=>{
    if (err)
      return cb(err);

     return cb(null, rows);
  });

}


//insert into property
exports.insertProperty =(prop_name,type,prop_image,description,area,owner,address,category,price) =>{

      return new Promise((resolve,reject)=>{
            //const sql =`INSERT INTO Property SET property_name =${fn.sql_escape(prop_name)},image_uri =${fn.sql_escape(prop_image)},description = ${fn.sql_escape(description)},PropertyPrice =${fn.sql_escape(price)},PropertyAddress =${fn.sql_escape(address)},propertytype = ${proptype},category = ${categ},propertyAgent =${propowner},area = ${proparea}`;
          
            const sql =`INSERT INTO Property(property_name,image_uri,description,PropertyPrice,PropertyAddress,propertytype,category,propertyAgent,area)
             VALUES(?,?,?,?,?,?,?,?,?)`
            conn.query(sql,[prop_name,type,prop_image,description,area,owner,address,category,price]
              ,(err,results)=>{
                if(err){
                  reject(err)
                }
                resolve(results)
            })
      })
  
}

//update property
exports.updateProperty =(Id,data)=>{
  const sql = "UPDATE PROPERTY SET ?"
  return new Promise((resolve,reject)=>{
    const sql = conn.query(sql,[data],(err,data)=>{
      if(err){
        reject(err)
      }
      else{
        resolve(data)
      }
    })
  })


}
//del a property
exports.delData =(Id,tbl)=>{
  const sql =`DELETE FROM  WHERE id =${Id}`

  return new Promise((resolve,reject)=>{
     conn.query(sql,[Id,tbl],(err,row)=>{
      if(err){
        reject(err)
      }
      resolve(row)
     })
  })

}

//add features
exports.addFeatures =(feature,desc)=>{
  const sql = `INSERT INTO features(feature,description) VALUES(${fn.sql_escape(feature)},${fn.sql_escape(desc)})`;
  return new Promise((resolve,reject)=>{
        conn.query(sql,[feature],(err,rows)=>{
    if(err){
      reject(err)
    }
    resolve(rows)
  })
  })
}

//edit feat
exports.editFeature =(Id,feat,desc)=>{
  const sql =`Update features SET ?`
  conn.query(sql,[Id,feat,desc],(err, feature)=>{
    if(err){
      return err;

    }
    return feature
  })

}

exports.deletFeature =(Id)=>{
  return new Promise((resolve,reject)=>{
    conn.query(`DELETE FROM features WHERE feat_id =${Id}`,[Id],(err,row)=>{
      if(err){
        reject(err)
      }
      resolve(row)
    })
  })
}

//get property of client
exports.getClientProperty = (clientId)=>{
  const sql =`SELECT * FROM property WHERE client_id =${clientId}`
    conn.query(sql,[clientId],(err,props)=>{
      if(err) throw err;
      return props
    })
  
}

//get property in a location
exports.getAreaProperty = (Id,cb)=>{
    
    
      const qs =`SELECT p.property_name,p.PropertyPrice,p.PropertAddress,p.description,pp.type ,c.propertyCategory FROM Property p 
      INNER JOIN propertyCategory c ON p.category = c.id INNER JOIN property_type pp ON p.propertytype = pp.type_id WHERE p.area =${Id}`;
      conn.query(qs,[Id],(err,results)=>{
        if(err)
         return cb(err)
        return cb(null,results)
       }) 
}

//add a facility
exports.AddFacility =(facility) =>{
     return new Promise((resolve,reject)=>{
       conn.query(`INSERT INTO facility SET ?`,[facility],(err,rows)=>{
            if(err){
              reject(err)
            }
            resolve(rows)
       })
     })
}


exports.RegiserPropertyFacility = (prop,propfacility) =>{
        return new Promise((resolve,reject)=>{
       conn.query(`INSERT INTO propertyFacilty(Property,Facility) VALUES(?,?)`,[prop,propfacility],(err,rows)=>{
            if(err){
              reject(err)
            }
            resolve(rows)
       })
     })
}

exports.getPropertyFacility = (propertyId,cb) =>{
 conn.query(`SELECT p.Facility,f.Facility_name FROM propertyFacilty p INNER JOIN Facility f ON p.Facility = f.id 
  INNER JOIN Property pp ON p.Property = pp.id WHERE p.Property =${proprtyId}`,[propertyId],(err,rows)=>{
      if(err){
        return cb(null,false)
      }
      return cb(null,rows)
 })

}
//edit a facility
exports.editFacility =(facility) =>{
     return new Promise((resolve,reject)=>{
       conn.query(`UPDATE facility SET ?`,(err,rows)=>{
            if(err){
              reject(err)
            }
            resolve(rows)
       })
     })
}


//register property type
exports.propertyType =(type) =>{
     return new Promise((resolve,reject)=>{
       conn.query(`INSERT INTO property_type SET ?`,(err,rows)=>{
            if(err){
              reject(err)
            }
            resolve(rows)
       })
     })
}
//add facility
exports.addFacility =(facilty) =>{
  return new Promise((resolve,reject)=>{
    conn.query(`INSERT INTO Facility SET ?`,(err,rows)=>{
         if(err){
           reject(err)
         }
         resolve(rows)
    })
  })
}
//add a facility
exports.AddpropertyCategory =(category) =>{
     return new Promise((resolve,reject)=>{
       conn.query(`INSERT INTO propertyCategory (propertyCategory) VALUES(${fn.sql_escape(category)})`,[category],(err,rows)=>{
            if(err){
              reject(err)
            }
            resolve(rows)
       })
     })

}
//add a facility
exports.insertPropertyOwner =(name,contacts,email,address) =>{
     return new Promise((resolve,reject)=>{
       conn.query(`INSERT INTO propertyOwner(name,contacts,email,address) 
        VALUES(${fn.sql_escape(name)},${fn.sql_escape(contacts)},
        ${fn.sql_escape(email)},${fn.sql_escape(address)})`,[name,contacts,email,address],(err,rows)=>{
            if(err){
              reject(err)
            }
            resolve(rows)
       })
     })
   }
//get property faclilities
exports.getPropFacility =()=>{}



//register country
exports.addcountry =(country)=>{
     return new Promise((resolve,reject)=>{
       conn.query(`INSERT INTO countries(country_name) VALUES(${fn.sql_escape(country)})`,[country],(err,rows)=>{
            if(err){
              reject(err)
            }
            resolve(rows)
       })
     })

}

//register city
exports.addcity =(city,country_id)=>{
     return new Promise((resolve,reject)=>{
       conn.query(`INSERT INTO city_town(town_name,country) VALUES(?,?)`,[city,country_id],(err,rows)=>{
            if(err){
              reject(err)
            }
            resolve(rows)
       })
     })

}

//


