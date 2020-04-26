const { Router } = require('express')

const client = Router();

const cln = require('../../controllers/clients');
const { validation } = require('../../middlewares/middleware');

client
     .route('/')
     .get(cln.getAllClients)
     .post(cln.Register_user_info)


client
    .route('/client/:id')
    .get(cln.getSingleClient)
    .delete(cln.del_client_info)
    .patch(cln.updateClient)



module.exports = client;
