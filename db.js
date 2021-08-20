
const util = require('./utils')
// const models = require('./models');

const log = util.Logger



module.exports = (db)=> {

		try{

			await db.sequelize.authenticae()
			log.info(`${util.logPrefix('db')} connection error successful`)

          db.sequelize.sync()


		}catch(e){
			log.error(`${util.logPrefix('db')} connection error = ${e}`)

		}
}