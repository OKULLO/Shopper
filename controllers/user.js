const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const { User } = require('../database/models');

// @desc      Get all users
// @route     GET /api/v1/auth/users
// @access    Private/Admin
exports.getUsers = (model)=>asyncHandler(async (req, res, next) => {
  // res.status(200).json(res.advancedResults);
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // Finding resource
  query = model.findAll(JSON.parse(queryStr));
  // console.log(query);

  //  // Select Fields
  // if (req.query.select) {
  //   const fields = req.query.select.split(',').join(' ');
  //   query = query.select(fields);
  // }

  // // Sort
  // if (req.query.sort) {
  //   const sortBy = req.query.sort.split(',').join(' ');
  //   query = query.sort(sortBy);
  // } else {
  //   query = query.sort('-createdAt');
  // }

  //   // Pagination
  // const page = parseInt(req.query.page, 10) || 1;
  // const limit = parseInt(req.query.limit, 10) || 25;
  // const startIndex = (page - 1) * limit;
  // const endIndex = page * limit;
  // const total = await model.countDocuments();

  // query = query.skip(startIndex).limit(limit);

  // if (populate) {
  //   query = query.populate(populate);
  // }

  // // Executing query
  const results = await query;

  // // Pagination result
  // const pagination = {};

  // if (endIndex < total) {
  //   pagination.next = {
  //     page: page + 1,
  //     limit
  //   };
  // }

  // if (startIndex > 0) {
  //   pagination.prev = {
  //     page: page - 1,
  //     limit
  //   };
  // }

 

  return res.status(200).json({
    success:true,
    length:results.length,
    data:results
  });



});

// @desc      Get single user
// @route     GET /api/v1/auth/users/:id
// @access    Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({where: {user_id: req.params.id }});

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc      Create user
// @route     POST /api/v1/auth/users
// @access    Private/Admin
// exports.createUser = asyncHandler(async (req, res, next) => {
//   const user = await User.create({req.body});

//   res.status(201).json({
//     success: true,
//     data: user
//   });
// });

// @desc      Update user
// @route     PUT /api/v1/auth/users/:id
// @access    Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const { username, contact ,email } = req.body || ""

  const user = await User.findOne({where:{user_id:req.params.id}});

  const newuser = await user.set({
    username:username,
    email:email,
    contact:contact
  })
  await newuser.save()

  res.status(200).json({
    success: true,
    data: newuser
  });
});

// @desc      Delete user
// @route     DELETE /api/v1/auth/users/:id
// @access    Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
 const user = await User.findOne({where:{user_id:req.params.id}});
 await user.destroy()

  res.status(200).json({
    success: true,
    message: "user deleted"
  });
});
