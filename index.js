require('dotenv').config()
const express= require('express')

const bookRouter=require('./router/bookRouter')
const userRouter=require('./router/userRouter')

const cors = require('cors')
const adminRouter = require('./router/adminRouter')
require('./config/db')
const bookstoreServer=express()


bookstoreServer.use(cors())
bookstoreServer.use(express.json())
bookstoreServer.use(bookRouter)
bookstoreServer.use(userRouter)
bookstoreServer.use(adminRouter)
bookstoreServer.use('./uploads',express.static('./uploads'))


const PORT =3000 || process.env.PORT

bookstoreServer.get('/',(req,res)=>{
    res.json("BookStore server")
})

bookstoreServer.listen(PORT,()=>{
    console.log("Bookstore Server running on the port " +PORT);
})