const express = require('express');
const user = require('../controllers/user');

const { User } = require('../database/models');


const advancedResults = require('../middlewares/advancedResult');

const { protect, authorize } = require('../middlewares/auth');


module.exports =(router)=>{

    // const router = serv.Router({ mergeParams: true });

    router.use(protect);
    router.use(authorize('admin'));

    router
      .route('/')
      .get(advancedResults(User), user.getUsers)
      .post(user.createUser);

    router
      .route('/:id')
      .get(user.getUser)
      .put(user.updateUser)
      .delete(user.deleteUser);


}



