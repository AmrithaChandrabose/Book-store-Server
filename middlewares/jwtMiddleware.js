const jwt = require('jsonwebtoken')

const jwtMiddleware = (req, res, next) => {
    console.log("Inside JWT middleware");

    // find the token
    const token = req.headers.authorization.slice(7)
    console.log(token);

    try {
        //  Token verification
        const jwtVerification = jwt.verify(token, process.env.jwtKey)
        console.log(jwtVerification)
        req.payload=jwtVerification.userMail
          next()
    } catch (err) {
        res.status(401).json("Authentication error" +err)
    }
  
}

module.exports = jwtMiddleware