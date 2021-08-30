
const util = require('./utils')

//initialize logger
const log = util.Logger


module.exports = async (db)=> {

		try{

			await db.sequelize.authenticate()
			log.info(`${util.logPrefix('db')} connection successful`)


		}catch(e){
			log.error(`${util.logPrefix('db')} connection error = ${e}`)

		}
}