
const prop = require('../models/propertyFn')
const fn = require('../models/functions')



exports.addproperty = async(req,res,next)=>{
  
          
             const prop_name = req.body.prop_name ;
             const prop_image = req.body.prop_image;
             const description = req.body.description;
             const area= req.body.location
             const type = req.body.type
             const address = req.body.address
             const category = req.body.category
             const owner = req.body.owner
             const price =req.body.price


              return new Promise((resolve,reject)=>{
                    const sql =`INSERT INTO Property SET property_name =${fn.sql_escape(prop_name)},image_uri =${fn.sql_escape(prop_image)},description = ${fn.sql_escape(description)},PropertyPrice =${fn.sql_escape(price)},PropertyAddress =${fn.sql_escape(address)},propertytype = ${fn.sql_escape(type)},category = ${category},propertyAgent =${fn.sql_escape(owner)},area = ${area}`;
                  
                    //const sql =`INSERT INTO Property(property_name,image_uri,description,PropertyPrice,PropertyAddress,propertytype,category,propertyAgent,area)
                    // VALUES(?,?,?,?,?,?,?,?,?)`
                    conn.query(sql,[prop_name,type,prop_image,description,area,owner,address,category,price]
                      ,(err,result)=>{
                        //let data =[];
                        if(err){
                          reject(err=>{
                            return res.send({
                              success:false,
                              error:err

                            })
                          })
                        }
              
                        resolve(result)
              })
            })


     
}

/*
 list all properties
*/

exports.listProperties = (req, res, next)=>{

         prop.listProps((err,results)=>{
            let properties =[];

          if(!err){
           results.forEach(row=>{
            properties.push(row)
           })
           return res.status(200).json({
            success:true,
            count:properties.length,
            data:properties
          })

          }else{
            next(err)
          }
          
        })
         

}

exports.latestProps = async(req ,res,next)=>{
      let props;
      try{
        props = await prop.latestProps()
        return res.status(200).json({
          success:true,
          count:props.length,
          data:props
        })

      }
      catch(e){
        next(e)

      }
}

exports.delProps = async(req , res, next)=>{
	    const Id = req.params.id;
      try {
        const del =  await props.delData(Id,"Property")
        return res.status(200).json({
          success:true,
          deleted:del.affectedRows
        })
      } catch (e) {
        next(e)
      }
}
//edit features
exports.editFeat = async (req, res,next)=>{
     const feature = req.body.feature|| ""
     const description = req.body.decription|| ""
       

    let updated;
          try {

            updated = await prop.editFeature(req.params.id,feature,description)
             return res.status(200).json({
              success:true,
              data:updated
            });
          }catch(e){
            next(e)
          }
}

//update property
exports.updateProps = async(req , res ,next)=>{
     const type = req.body.type|| ""
     const name = req.body.name || ""
     const contacts = req.body.image_uri  || ""
     const location = req.body.location || ""

     const data = {
     	type:type,
     	name:name,
     	contacts:contacts,
     	location:location
     }

    let updated;
          try {

            updated = await prop.updateProperty(req.params.id,data)
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


exports.addFeature = async(req, res,next)=>{
   const { feature, description } = req.body;

   let feat;
    try{
      feat = await prop.addFeatures(feature,description)
          return res.status(201).json({
            success:true,
            data:feat
          })
    }
    catch(e){
      next(e)
    }
}
//add facility
exports.addFacility = async(req, res,next)=>{
  const { facility } = req.body;

  let data;
   try{
     data = await prop.addFacility(facility)
         return res.status(201).json({
           success:true,
           data:data
         })
   }
   catch(e){
     next(e)
   }
}


exports.delFeat = async(req,res,next)=>{
       const Id = req.params.id;
      try {
        const del =  await prop.delData(Id,"features")
        return res.status(200).json({
          success:true,
          deleted:del.affectedRows
        })
      } catch (e) {
         next(e)
      }

}

// features of a property
exports.featProps = async(req,res, next)=>{
	const id = req.params.id;
     let feature;
     try{
         feature = await prop.getFeature(id);
         if(!feature){
           return res.status(404).json({
             success:false,
             error:'feature not found '
           })
          }else{
           return res.status(200).json({
             success:true,
             data:feature
           })
         }
     }
     catch(e){
       next(e)
     }
}

//get feature by id
exports.getFeat = (req,res,next)=>{
       try{
         prop.getById(req.params.id,"features",(err,feat)=>{
          if(err){
            return res.json({
             success:false,
             error:err
           })
          }
          return res.status(200).json({
             success:true,
             data:feat
           })
         });
         
       }
       catch(e){
         next(e)
       }
}

//add owner to db
exports.addOwner = async(req ,res ,next)=>{
      const {name,contacts,email,address } = req.body;
      let owner;
      try{
 
         owner = await prop.insertPropertyOwner(name,contacts,email,address);
          return res.status(201).json({
            success:true,
            row:owner
          })
      
      }
      catch(e){
        next(e)
      }
}


//insert a facility to a property
exports.PropertyFacility = async(req,res,next)=>{
      const { property ,facility}  = req.body;
      let data;
      try{
 
         data = await prop.RegiserPropertyFacility(property,facility);
          return res.status(201).json({
            success:true,
            row:data
          })
      
      }
      catch(e){
        next(e)
      }
}

//get feature by id
exports.getPropertyFacility = (req,res,next)=>{
     prop.getPropertyFacility(req.params.id,(err,rows)=>{
      if(err){
        return res.status(400).send({
          success:false,
          error:err
        })
      }
      return res.status(200).send({
        success:true,
        data:rows.length
      })
    })
   
}

//add categrory
exports.Addcategory = async(req ,res ,next)=>{
      const { category } = req.body;
      let props_category;
      try{
 
         props_category = await prop.AddpropertyCategory(category);
          return res.status(201).json({
            success:true,
            row:props_category
          })
      
      }
      catch(e){
        next(e)
      }
}


//image uploads with multer
exports.UploadImages = ( req ,res,next)=>{
        try {
          const photos = req.files;

          // check if photos are available
          if (!photos) {
              res.status(400).send({
                  success: false,
                  data: 'No photo is selected.'
              });
          } else {
              let data = [];

              // iterate over all photos
              photos.map(p => data.push({
                  name: p.originalname,
                  mimetype: p.mimetype,
                  size: p.size
              }));

              // send response
              res.status(200).send({
                  success: true,
                  message: 'Photos are uploaded.',
                  data: data
              });
          }

      } catch (e) {
          next(e)
        }
}

//list properties by area location
exports.listPropertyArea = (req ,res,next)=>{
  
      prop.getAreaProperty(req.params.id,(err,results)=>{
        let properties = []
        if(!err){
          results.forEach(row=>{
            properties.push(row)
           })
          return res.status(200).send({
            success:true,
            count:properties.length,
            data:properties
           })
        }
        else{
          next(err)
        }
        
        
      });
}


exports.country = async(req ,res ,next)=>{
      const { country } = req.body;
      let count;
      try{
 
         count = await prop.addcountry(country);
          return res.status(201).json({
            success:true,
            row:count
          })
      
      }
      catch(e){
        next(e)
      }
}
//add city
exports.city = async(req ,res ,next)=>{
      const { city ,country } = req.body;
      let data;
      try{
 
         data = await prop.addcity(city,country);
          return res.status(201).json({
            success:true,
            row:data
          })
      
      }
      catch(e){
        next(e)
      }
}

//getLatestProps



