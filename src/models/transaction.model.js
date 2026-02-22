import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    fromAccountId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Account",
        required:true,
        index:true
    },
    toAccountId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Account",
        required,
        index:true
    },
    amount:{
        type:Number,
        required:true
    },
    currency:{
        type:String,
        default:"INR"
    },
    status:{
        type:String,
        enum:{
            values:["Failed", "Pending", "Completed"],
            message:"Status must be either Failed, Pending or Completed"
        },
        default:"Pending"
    },
    idempotencyKey:{ // To prevent duplicate transactions, always generated at client side and sent with transaction request
        type:String,
        required:true,
        unique:true,
        index:true
    }
});

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;