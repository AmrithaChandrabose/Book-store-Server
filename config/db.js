const mongoose=require('mongoose')

mongoose.connect(process.env.connectionString).then(()=>{
    console.log("BookStore server connected to DB")
}).catch((err)=>{
        console.log("Server error" +err)
})