
const conn = require('../config/dbConfig')


//returns an escaped value passed into query
exports.sql_escape =(value)=>{
    const escaped_value = conn.escape(value)

    return escaped_value;
}

exports.escapeId =(value)=>{
    const escaped_value = conn.escapeId(value)

    return escaped_value;
}

exports.runQuery = async(qry, arrParams)=> {
    // params is array[]
    let result;
    try {
        result = await conn.query(qry, arrParams);
    } catch (error) {
        console.error(error);
    }
    return result;
}


