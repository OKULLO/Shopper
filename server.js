/**
* Nyumba Routes
*
* Our routes make heavy use of install node modules where possible
* to avoid duplication of code and ensure easy maintenance
*
**/
const express = require('express')
const fs = require('fs-extra')
const path = require('path')
const helmet = require('helmet')
// const compression = require('compression')

const util = require('./utils')
const db = require('./database/models');


const log = util.Logger
log.setLevel('debug')
const morgan  = require('morgan');
const dotenv = require('dotenv');
const bodyparser = require('body-parser');
const cors = require('cors');

const server = express()

// ----------------------------------------------------------------------------
server.disable('x-powered-by')
// server.use(compression())
dotenv.config({path:'./config/.env'});

server.use((req,res,next) => {
    const notRoute = (route) => {
        return req.url.indexOf(route) === -1
    }
    if (notRoute('/styles') 
        && notRoute('/webfonts') 
        && notRoute('/api/tiles')
    ) {
        log.info(`[request] ${req.url}`)
    }
    next()
})


//-----------------------json parsing---------------------------------
server.use(express.json());
server.use(bodyparser.urlencoded({extended: false}));

server.use(morgan('common'));
server.use(cors({
    origin:process.env.CORS_ORIGIN
}));


// ---------------------static file path----------------------------

const staticPath = path.resolve(__dirname, './public/')
server.use(express.static(staticPath))



// ------------------------------------------------------------------------- Static
server.use(helmet())
//file upload error
server.use(require('./middlewares/errors').uploadErr)


//return original url where error occured
// server.use(require('./middlewares/errors').NotFound);

//error handler middleware
server.use(require('./middlewares/errors').errorHandler);


// ------------------------------------------------------------------------- Routes
const routeFiles = fs.readdirSync(path.resolve(__dirname, './routes'))
routeFiles.forEach((file) => {
    log.debug('[route] ' + file)
    require('./routes/' + file)(server)
})


// ------------------------------------------------------------------------- Database
db.sequelize.authenticate()
     .then(()=>log.info('database connection sucessfull'))
      .catch(e=>log.error(`database connection error:${e}`))

module.exports = server