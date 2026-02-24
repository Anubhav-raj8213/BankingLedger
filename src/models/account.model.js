import mongoose from "mongoose";
import { Ledger} from "./index.js";

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

accountSchema.methods.getBalance = async function(){
    const accountId = this._id;
    const ledgerEntries = await Ledger.aggregate([
        // 1. Filter entries for this specific account
        {
            $match: { account: accountId }
        },
        // 2. Group and calculate totals
        {
            $group: {
                _id: null,
                totalDebits: {
                    $sum: {
                        $cond: [{ $eq: ["$type", "Debit"] }, "$amount", 0]
                    }
                },
                totalCredits: {
                    $sum: {
                        $cond: [{ $eq: ["$type", "Credit"] }, "$amount", 0]
                    }
                }
            }
        },
        // 3. Project the final math
        {
            $project: {
                _id: 0,
                balance: { $subtract: ["$totalCredits", "$totalDebits"] }
            }
        }
    ]);

    return ledgerEntries.length > 0 ? ledgerEntries[0].balance : 0;
}

const  Account = mongoose.model("Account", accountSchema);
export default Account;