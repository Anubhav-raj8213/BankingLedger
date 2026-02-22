import User from "../models/users.model.js";
import jwt from "jsonwebtoken";

export default async function authMiddleware(req,res,next){
    try{
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
        if(!token){
            return res.status(401).json({
                message: "Unauthorized access, token is missing"
            })
        }
        const decodedTokoen = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decodedTokoen.userID).select(" _id, name, email");
        if(!user){
            return res.status(401).json({
                message:"Unauthorized access, user not found"
            })
        }
        req.user = user;
        next();
    }
    catch (error) {
        console.log("Error in auth middleware", error);
        return res.status(500).json({
            message: "Internal server error in auth middleware"
        })
    }
}