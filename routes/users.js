const express = require('express');
const user = require('../controllers/user');

const { User } = require('../database/models');


const advancedResults = require('../middlewares/advancedResult');

const { protect, authorize } = require('../middlewares/auth');


module.exports =(router)=>{

    // const router = serv.Router({ mergeParams: true });

    // router.use(protect);
    // router.use(authorize('admin'));

    router
      .route('/api/v1/users')
      .get(protect,authorize('admin'),user.getUsers(User))
      // .post(user.createUser);

    router
      .route('/api/v1/users/:id',authorize('admin'))
      .get(user.getUser,authorize('admin'))
      .put(user.updateUser,authorize('admin'))
      .delete(user.deleteUser,authorize('admin'));


}



