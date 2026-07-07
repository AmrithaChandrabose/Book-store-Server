const jwt = require('jsonwebtoken')

const adminJwtMiddleware = (req, res, next) => {
    console.log("Inside Admin JWT middleware");
 

    // find the token
    const token = req.headers.authorization.slice(7)
    console.log(token);

    try {
        //  Token verification
        const jwtVerification = jwt.verify(token, process.env.jwtKey)
        console.log(jwtVerification)
        req.payload=jwtVerification.userMail

        // admin role
        req.role=jwtVerification.role
        if(jwtVerification.role=="Admin"){
            next()
        }
        else{
            console.log(jwtVerification.role);//
            
            res.status(403).json("Access denied")
        }
          
    } catch (err) {
        res.status(401).json("Authentication error" +err)
    }
  
}

module.exports = adminJwtMiddleware






// exports.getAllUsers = async (req, res) => {
//     try {
//         const users = await user.find().
// // select("-password");
//         res.status(200).json({ message: "Users fetched successfully", users });
//     } catch (err) {
//         res.status(500).json({ message: "Server error",err});
//     }
// };