/**
* Nyumba App Server
*
* We serve web logic with Express and the database at the same origin.
*
**/
const fs = require('fs-extra')
const path = require('path')
fs.ensureDirSync(path.resolve(__dirname, '../logs'))


const http = require('http')
const https = require('https')
const app = require('./server')
const util = require('./utils')

const log = util.Logger



// ----------------------------------------------------------------------
/**
* Start HTTP Server
*/
const startServer = () => {
    return new Promise((resolve, reject) => {
        let secureServer = null
        // start the web server 
        let httpServer = http.createServer(app)
        console.log(httpServer.address())
        // secureServer.listen(util.getHttpsPort(), () => {
        let stdServer = httpServer.listen(util.getHttpPort(), () => {

            log.info(`${util.logPrefix('web')} standard port = ${util.getHttpPort()}`)
            
            if (secureServer) {
                log.info(`${util.logPrefix('web')} secure port = ${util.getHttpsPort()}`)
                
            } else {
                log.warn(`${util.logPrefix('web')} falling back to http for local development...`)

            }
        
            resolve(secureServer || stdServer)
        })
    // })
    })
}


// -------------------server------------
startServer()
    .then((server) => {
        // return setupDatabase(server, app)
        //handle database sync here
        // you can chain multiple .then()
    })
    .catch((e) => {
        log.error('Failed to start server:')
        log.error(e)
    })