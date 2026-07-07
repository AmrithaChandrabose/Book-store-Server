const express=require('express')
const bookController=require('../controllers/bookController.js')
const bookRouter=express.Router()
const jwtMiddleware=require('../middlewares/jwtMiddleware.js')
const multerConfig=require('../middlewares/multerMiddleware.js')

bookRouter.get('/api/homebooks',bookController.getHomeBooks)

// JWT Implementation
bookRouter.get('/api/books',jwtMiddleware,bookController.getAllBooks)
bookRouter.get('/api/viewABook/:id',jwtMiddleware,bookController.viewABook)
bookRouter.post('/api/addBook',jwtMiddleware,multerConfig.array('UploadedImages',3),bookController.addBook)
bookRouter.put('/api/makePayment',jwtMiddleware,bookController.bookPayment)


module.exports=bookRouter