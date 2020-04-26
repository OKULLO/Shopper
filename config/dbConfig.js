
const mysql = require('mysql2')


// Get the Host from Environment or use default
const host = process.env.DB_HOST || 'localhost';

// Get the User for DB from Environment or use default
const user = process.env.DB_USER || 'root';

// Get the Password for DB from Environment or use default
const password = process.env.DB_PASS || '';

// Get the Database from Environment or use default
const database = process.env.DB_DATABASE || 'Nyumba';

// Create the connection with required details
const dbConfig = mysql.createConnection({
  host, user, password, database,
});

dbConfig.connect((err)=>{
    if(err){
        console.log(err)
    }
    console.log('connected')
})

module.exports = dbConfig
