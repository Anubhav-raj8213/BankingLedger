import {User, Account, Ledger, Transaction} from "../models/index.js";

async function createTransactionController(req,res){
    try{
        const {fromAccountId, toAccountId, amount, idempotencyKey} = req.body();
        if(!fromAccountId || !toAccountId || !amount || !idempotencyKey){
            return res.status(400).json({
                message:"Please provide fromAccountId, toAccountId and amount"
            });
        };
    }
    catch (error) {
        console.log("Error creating transaction", error);
        return res.status(500).json({
            message:"Internal server error while creating transaction"
        })
    }
}

async function getTransactionsController(req,res){
}

export {
    createTransactionController,
    getTransactionsController
};