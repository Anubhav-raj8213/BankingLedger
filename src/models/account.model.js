import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:[true, "Account is required"],
        unique:true,
        index:true
    },
    status:{
        type:String,
        enum:{
            values:["Active", "Frozen", "Closed"],
            message:"Status must be either Active, Frozen or Closed"
        },
        default:"Active"
    },
    currency:{
        type:String,
        required:[true, "Currency is required"],
        default:"INR"
    }
}, {timestamps:true});

accountSchema.index({ userId:1, status:1 });

const  Account = mongoose.model("Account", accountSchema);
export default Account;