const express = require('express')
const morgan  = require('morgan');
const dotenv = require('dotenv');
const bodyparser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');

const db = require('./config/dbConfig');
const { Errors ,uploadError} = require('./middlewares/middleware');

const clients_api = require('./routes/api/clients')
const property = require('./routes/api/property')
const auth_api = require('./routes/auth/auth')

dotenv.config({path:'./config/.env'});

const server = express();


server.use(express.json());
server.use(bodyparser.urlencoded({extended: false}));

server.use(morgan('common'));
server.use(cors({
    origin:process.env.CORS_ORIGIN
}));

server.use(helmet());


server.use('/api/clients/', clients_api);
server.use('/auth', auth_api);
server.use('/api/property',property)

const PORT = process.env.PORT || 3000;

//file upload err
server.use(Errors.uploadErr)

//return original url where error occured
server.use(Errors.NotFound);

//error handler middleware
server.use(Errors.errorHandler);


const serve =server.listen(PORT,()=>{
  const host = serve.address().address
  const port = serve.address().port
  console.log(`server is running in ${process.env.NODE_ENV} mode on http://${host}:${port}`);
});
