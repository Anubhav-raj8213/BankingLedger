import User from  "../models/users.model.js";
import bcrypt from "bcrypt";
import cookies from "cookie-parser";
import jwt from "jsonwebtoken";
import { sendRegistrationEmail, sendLoggedInEmail } from "../services/email.services.js";

async function reggisterUser(req,res) {
    const {email,password,name} = req.body;
    if(!email || !password || !name){
        console.log("Missing required fields");
        return res.status(400).json({
            message: "Please provide email, password and name"
        })
    };
    const isUserExist = await User.findOne({email});
    if(isUserExist){
        console.log("User already exists");
        return res.status(400).json({
            message:"User already exists with this email"
        })
    };
    try {
        const user = User.create({
            email,
            password,
            name
        });
        const token = jwt.sign(
            {userID : user._id},
            process.env.JWT_SECRET,
            {expiresIn:"3d"}
        );
        res.cookie("token", token, {
            httpOnly:true,
        })
        await sendRegistrationEmail(user.email, user.name);

        return res.status(201).json({
            message:"User registered successfully",
            user:{
                _id:user._id,
                name:user.name,
                email:user.email,
            },
            token:token
        })

    }
    catch (error) {
        console.log("Error registering the user", error);
        return res.status(500).json({
            message:"Error registering the user"
        });
    };
}


async function loginUser(req,res){
    try{
        const {email,password} = req.body;
        if(!email || !password) return res.status(400).json({
            message:"Please provide email and password"
        });
        const user = await User.findOne({email}).select("password email name");
        if(!user)  return res.status(400).json({
            message:"Invalid email or password"
        })
        if(!await user.comparePassword(password)) return res.status(400).json({
            message: "Invalid email or password"
        })
        const token = jwt.sign(
            {userID:user._id},
            process.env.JWT_SECRET,
            {expiresIn:"3d"}
        )
        res.cookie("token", token), {
            httpOnly:true,
            secured:true
        };
        await sendLoggedInEmail(user.email, user.name);
        return res.status(200).json({
            message:"User logged in successfully",
            user:{
                _id:user._id,
                name:user.name,
                email:user.email,
            },
            token:token
        })
    }
    catch (error) {
        console.log("Error logging in the user", error);
        return res.status(500).json({
            message:"Error logging in the user"
        })
    }
}


export {
    reggisterUser,
    loginUser
}