const user = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// REGISTER
exports.register = async (req, res) => {
    const { username, email, password } = req.body
    try {
        const existingUser = await user.findOne({ email })
        if (existingUser) {
            res.status(200).json({ message: "user already existing" })
        }
        else {
            // password encryption
            const encryptedPassword = await bcrypt.hash(password, 10)
            console.log(encryptedPassword);

            const newuser = new user({ username, email, password: encryptedPassword })
            await newuser.save()
            res.status(200).json({ message: "Successfully registered", newuser })
        }
    } catch (err) {
        res.status(500).json({ message: "Server not found" + err })
    }
}

// LOGIN
exports.login = async (req, res) => {
    const { email, password } = req.body
    try {
        const existingUser = await user.findOne({ email })
        console.log(existingUser);

        if (existingUser) {
            let enPassword = await bcrypt.compare(password, existingUser.password)
            if (existingUser.password == password || enPassword) {

                //JWT TOKEN
                const token = jwt.sign({ userMail: existingUser.email, role: existingUser.role }, process.env.jwtKey)
                console.log(token)
                res.status(200).json({ message: "Successfully login", existingUser, token })
            }
            else {
                res.status(201).json({ message: "Password mismatch" })
            }
        }
        else {
            res.status(404).json({ message: "User not found " })
        }

    } catch (err) {
        res.status(500).json({ message: "Server error" + err })
    }
}

// GOOGLE LOGIN
exports.googleLogin = async (req, res) => {
    const { email, password, username, profile } = req.body
    try {
        const existingUser = await user.findOne({ email })
        if (existingUser) {
            // let enPassword = await bcrypt.compare(password, existingUser.password)
            // if (existingUser.password == password || enPassword) {

            //JWT TOKEN
            const token = jwt.sign({ userMail: existingUser.email }, process.env.jwtKey)
            console.log(token)
            res.status(200).json({ message: "Successfully login", existingUser, token })

            // else {
            //     res.status(201).json({ message: "Password mismatch" })
            // }
        }
        else {
            // const encryptedPassword = await bcrypt.hash(password, 10)
            // console.log(encryptedPassword);
            const newuser = new user({ username, email, password, profile })
            await newuser.save()
            res.status(200).json({ message: "New Google user added...", newuser, token })
        }

    } catch (err) {
        res.status(500).json({ message: "Server error" + err })
    }
}

// update user
exports.updateUser = async (req, res) => {
    console.log("Inside function")

    const { username, password, bio, profile } = req.body
    const email = req.payload
    const uploadProfile = req.file ? req.file.filename : profile

    try {

        const updateUser = await user.findOneAndUpdate({ email }, { username, email, password, bio, profile: uploadProfile }, { new: true })
        await updateUser.save()
        res.status(200).json({ message: "Successfully updated...", updateUser })
    }
    catch (err) {
        res.status(500).json({ message: "Server not found" + err })
    }
}

// get all users
exports.getAllUsers = async (req, res) => {
    console.log("Get all users")
    try {
        const getAllUsers = await user.find({ role: { $ne: "Admin" } }, { password: 0 })
        res.status(200).json({ message: "All users fetched" , getAllUsers} )
    } catch (err) {
        res.status(500).json({ message: "Server not found" + err })
    }
}










