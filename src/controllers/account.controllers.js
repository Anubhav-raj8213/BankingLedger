import Account from "../models/account.model.js";
import User from "../models/users.model.js";



async function createAccountController(req,res){
    try{
        const user = await User.findById(req.user._id);
        const existingAccount = await Account.findOne({userId:user._id});
        if(existingAccount) return res.status(400).json({
            message: "Account already exists for this user"
        })
        const account = await Account.create({
            userId:user._id
        });
        return res.status(201).json({
            message:"Account created successfully",
            account:{
                _id:account._id,
                userId:account.userId
            }
        })
    }
    catch (error) {
        console.log(req.user);
        console.log("Error creating account", error);
        return res.status(500).json({
            message:"Internal server error while creating account"
        })
    }
}

export {
    createAccountController
}