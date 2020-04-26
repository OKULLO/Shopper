const { Router } = require('express')
const multer = require('multer')
const path = require('path')

const property = Router();

const prop = require('../../controllers/property')

//const file = require('../../middlewares/uploads')


//configure image uploads with multer
const uploads = multer({
        dest: path.join(__dirname,'../../uploads'),
        limits: {
            files: 5, // allow up to 5 files per request,
            fieldSize: 2 * 1024 * 1024 // 2 MB (max file size)
        },
        fileFilter: (req, file, cb) => {
            // allow images only
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
                return cb(new Error('Only image are allowed.'), false);
            }
            cb(null, true);
        }

})



property
      .route('/features/')
      .post(prop.addFeature)
property
      .route('/:id/facility/')
      .post(prop.PropertyFacility)
      .get(prop.getPropertyFacility)

property
      .route('/')
      .get(prop.listProperties)
      .post(prop.addproperty )

property
      .route('/:id')
      .delete(prop.delProps)
      



property
     .route('/own/')
     .post(prop.addOwner)

property
     .route('/facilities/')
     .post(prop.addFacility)

property
     .route('/country/')
     .post(prop.country)

property
     .route('/city/')
     .post(prop.city)

property
     .route('/areas/:id')
     .get(prop.listPropertyArea)
property
     .route('/categories/')
     .post(prop.Addcategory)


property
     .route('/features/:id')
     .delete(prop.delFeat)
     .patch(prop.editFeat)
     .get(prop.getFeat)

property.route('/:id/uploads/')
         .post( uploads.array('photos',8),prop.UploadImages)
     


 module.exports = property;