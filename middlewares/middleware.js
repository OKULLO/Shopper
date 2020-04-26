
 const Errors = {}
 const validation ={}

//not found error
 Errors.NotFound =(req,res,next)=>{
     const error = new Error(`Not Found-${req.originalUrl}`);
     res.status(404);
      next(error);
  }

//General error handler
Errors.errorHandler =(error,req,res,next)=>{
     const statusCode = res.statusCode===200 ?500:res.statusCode;

     res.status(statusCode);
     res.json({
         message:error.message,
         stack:process.env.NODE_ENV==='production'? '***':error.stack
     })
 }

 //file upload middleware validation

Errors.uploadErr =(err,req, res ,next)=>{
    if(err.code ==="INCORRECT_FILETYPE"){
        res.status(422).json({errors:"only images are allowed"})
       return;
    }
    if(err.code =="LIMIT_FILESIZE"){
        res.status(422).json({errors:'File size too large'});
        return;
    }
}


// middleware/auth.js
validation.validateRegister =(req, res, next) => {
      // username min length 3
      if (!req.body.username || req.body.username.length < 3) {
        return res.status(400).send({
          msg: 'Please enter a username with min. 3 chars'
        });
      }
      // password min 8 chars
      if (!req.body.password || req.body.password.length < 8) {
        return res.status(400).send({
          msg: 'Please enter a password with min. 8 chars'
        });
      }
      if (!req.body.email) {
        return res.status(400).send({
          msg: 'Please enter a valid email address'
        });
      }

      // password (repeat) does not match
      if (
        !req.body.password_repeat ||
        req.body.password != req.body.password_repeat
      ) {
        return res.status(400).send({
          msg: 'Both passwords must match'
        });
      }
      next();
    }
//protect routes
validation.isLoggedIn =(req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(
          token,
          'Sc34RE'  //secret key
        );
        req.userData = decoded;
        next();
    } catch (err) {
          return res.status(401).send({
            msg: 'Your session is not valid!'
          });
      }
}
//registr validations middleware
validation.UserInfo =(req,res,next)=>{
          let gender =["male","female"];
          let types =["property_client","agent","user"];
          //let dobs = new Date()

          if (!req.body.name) {
            return res.status(422).json({ errors: "Name  must be provided"});
          }
          if (!req.body.usertype) {
            return res.status(422).json({ errors: "Type of user must be provided"});
          }
          if (!types.includes(req.body.usertype)) {
            return res.status(422).json({ errors: "Type  must be one of " + types.toString()});
          }
          if (!req.body.gender) {
            return res.status(422).json({ errors: "Type of user must be provided"});
          }
          if (!gender.includes(req.body.gender)) {
            return res.status(422).json({ errors: "Type  must be one of " + gender.toString()});
          }
          if (!req.body.contacts) {
            return res.status(422).json({ errors: " contact must be provided"});
          }
          if (!req.body.email) {
            return res.status(422).json({ errors: " Email must be provided"});
          }
          if (!req.body.nationality) {
            return res.status(422).json({ errors: " Nationality must be provided"});
          }
          if (!req.body.address) {
            return res.status(422).json({ errors: " Address must be provided"});
          }
            
          if (!req.body.dob) {
            return res.status(422).json({ errors: " Date of birth must be provided"});
          }
          
          if (!req.body.nationality) {
            return res.status(422).json({ errors: " Nationality must be provided"});
          }
          if(!req.body.user_NIN) {
            return res.status(422).json({ errors: " NIN number must be provided"});
          }

}

//validate country Entry and city

validation.validateCountry =(req,res,next)=>{
        if(!req.body.country_name) {
          return res.status(422).json({ errors: "Country name is required"});
        }
        if(!req.body.city_name) {
          return res.status(422).json({ errors: " City is required"});
        }
}

//validate property
validation.property =(req,res,next)=>{
  if(!req.body.prop_name) {
    return res.status(422).json({ errors: "Property name is required"});
  }
  if(!req.body.description) {
    return res.status(422).json({ errors: " Description is required"});
  }
}

module.exports ={
  validation,
  Errors
}
