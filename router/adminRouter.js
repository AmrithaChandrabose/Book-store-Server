const express=require('express')
const bookController=require('../controllers/bookController.js')
const userController=require('../controllers/userController.js')
const adminJwtMiddleware=require('../middlewares/adminJwtMiddleware.js')

const adminRouter=express.Router()

//admin get all books
adminRouter.get('/api/getBooks',adminJwtMiddleware,bookController.getAllBooks)

//admin get all users
 adminRouter.get('/api/getUsers',adminJwtMiddleware,userController.getAllUsers)

//admin  approve
 adminRouter.put('/api/bookApproval',adminJwtMiddleware,bookController.approveAdminBooks)
 
//admin  reject
adminRouter.put('/api/bookReject',adminJwtMiddleware,bookController.rejectAdminBooks)


module.exports=adminRouter