
const prop = require('../models/propertyFn')
const fn = require('../models/functions')



exports.addproperty = async(req,res,next)=>{

      
          try {

            const prop_name = req.body.prop_name ;
            const prop_image = req.body.prop_image;
            const description = req.body.description;
            const area= req.body.location
            const type = req.body.type
            const address = req.body.address
            const category = req.body.category
            const owner = req.body.owner
            const price =req.body.price
            const refno = fn.generate_Randno()

            const data = await prop.insertProp(prop_name,type,prop_image,description,area,owner,address,category,price,refno)
               
                 return res.status(201).json({
                    success: true,
                    data:data
                 })
            
          } catch (e) {
            return res.status(500).json({
              success:false,
              error:`${e}`
            })
            
          }   
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
//latest properties
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

  const { prop_name,prop_image ,description,price,location,type,address,category,owner} = req.body || ""  
  

    let updated;
          try {

            updated = await prop.updateTblData(req.params.id,"Property",prop_name,prop_image ,description,location,type,address,price,category,owner)
             return res.status(201).json({
              success:true,
              data:updated,
              msg:'successfull'
            });
          }catch(e){
            return res.status(500).json({
              success:false,
              error:`${e.stack}`
            })
          }
}

//add features
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
        next(err)
      }
     if(rows){
      return res.status(200).send({
        success:true,
        data:rows
      })
     }
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
          const photos = req.body.files;

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
               prop.getByValue('Property','prop_refno',req.params.id,(err,rows)=>{
               if(err) throw err
                if(rows.length){
                  const id = rows[0]['id']
                  console.log(id)
                  prop.uploadPhoto(photos,id)
                  // send response
                  res.status(200).send({
                    success: true,
                    message: 'Photos are uploaded.',
                    data: data
                });
                }
             })
          //    res.status(200).send({
          //     success: true,
          //     message: 'Photos are uploaded.',
          //     data: data
          // });

             
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

//list properties by by owner
exports.listPropertyOwner = (req ,res,next)=>{
  
  prop.getOwnerProperty(req.params.owner,(err,results)=>{
    let properties = []
    if(!err){
      results.forEach(row=>{
        properties.push(row)
       })
      return res.status(200).json({
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



