
 const errors = {}
 

//-------------------------------------------------not found error
 errors.NotFound =(req,res,next)=>{
     const error = new Error(`Not Found-${req.originalUrl}`);
     res.status(404);
      next(error);
  }


//----------------------------------------------------General error handler
errors.errorHandler =(err,req,res,next)=>{
     let error = { ...err };

     error.message = err.message;

     const statusCode = res.statusCode===200 ?500:res.statusCode;

     
     res.status(statusCode).json({
         success: false,
         message:error.message,
         stack:process.env.NODE_ENV==='production'? '***':error.stack
     })
 }

 errors.ignoreFavicon =(req, res, next)=> {
  if (req.originalUrl.includes('favicon.ico')) {
    res.status(204).end()
  }
  next();
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