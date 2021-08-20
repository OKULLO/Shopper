
 const errors = {}
 

//-------------------------------------------------not found error
 errors.NotFound =(req,res,next)=>{
     const error = new Error(`Not Found-${req.originalUrl}`);
     res.status(404);
      next(error);
  }


//----------------------------------------------------General error handler
errors.errorHandler =(error,req,res,next)=>{
     const statusCode = res.statusCode===200 ?500:res.statusCode;

     res.status(statusCode);
     res.json({
         message:error.message,
         stack:process.env.NODE_ENV==='production'? '***':error.stack
     })
 }

 //------------------------------------------------file upload middleware validation

errors.uploadErr =(err,req, res ,next)=>{
    if(err.code ==="INCORRECT_FILETYPE"){
        res.status(422).json({errors:"only images are allowed"})
       return;
    }
    if(err.code =="LIMIT_FILESIZE"){
        res.status(422).json({errors:'File size too large'});
        return;
    }
}




module.exports =errors