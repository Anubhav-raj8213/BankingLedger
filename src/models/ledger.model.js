import mongoose from "mongoose";

const ledgerSchema = new mongoose.Schema({
    account:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Account",
        required:true,
        index:true,
        immutable:true
    },
    amount:{
        type:Number,
        required:true,
        immutable:true,
    },
    transaction:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        immutable:true,
        index:true
    },
    type:{
        type:String,
        enum:{
            values:["Credit", "Debit"],
            message:"Type must be either Credit or Debit"
        }
    }
}, {timestamps:true});

function preventModification(next){
    if(!this.isNew) return next(new Error("Ledger entries cannot be modified"));
    next();
}

ledgerSchema.pre("findOneAndUpdate", preventModification);
ledgerSchema.pre("updateOne", preventModification);
ledgerSchema.pre("updateMany", preventModification);
ledgerSchema.pre("update", preventModification);
ledgerSchema.pre("deleteOne", preventModification);
ledgerSchema.pre("deleteMany", preventModification);
ledgerSchema.pre("findOneAndDelete", preventModification);
ledgerSchema.pre("findOneAndRemove", preventModification);
ledgerSchema.pre("remove", preventModification);

const Ledger = mongoose.model("Ledger", ledgerSchema);
export default Ledger;