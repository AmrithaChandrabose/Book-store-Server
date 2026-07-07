const express=require('express')
const userController=require('../controllers/userController.js')
const jwtMiddleware=require('../middlewares/jwtMiddleware.js')

const multerMiddleware=require('../middlewares/multerMiddleware.js')

const userRouter=express.Router()

userRouter.post('/api/register',userController.register)
userRouter.post('/api/login',userController.login)
userRouter.post('/api/googleLogin',userController.googleLogin)
userRouter.put('/api/updateUser',jwtMiddleware,multerMiddleware.single('profile'),userController.updateUser)


module.exports=userRouter