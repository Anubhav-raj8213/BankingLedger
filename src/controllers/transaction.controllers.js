import {User, Account, Ledger, Transaction} from "../models/index.js";
import email from "../services/email.service.js";
import mongoose from "mongoose";

async function createTransactionController(req,res){
    try{
        const {fromAccountId, toAccountId, amount, idempotencyKey} = req.body();
        if(!fromAccountId || !toAccountId || !amount || !idempotencyKey){
            return res.status(400).json({
                message:"Please provide fromAccountId, toAccountId and amount"
            });
        };
        //Check if accounts exist
        const fromAccount = await Account.findById(fromAccountId);
        const toAccount = await Account.findById(toAccountId);
        if(!fromAccount || !toAccount){
            return res.status(404).json({
                message:"One or both accounts not found"
            })
        }
        //check if ideempotency key exists
        const existingTransaction = await Transaction.findOne({idempotencyKey});
        if(existingTransaction){
            if(existingTransaction.status === "Completed"){
                return res.status(200).json({
                    message:"Transaction already completed",
                    transaction:existingTransaction
                })
            }
            if(existingTransaction.status === "Pending"){
                return res.status(200).json({
                    message:"Transaction is pending",
                    transaction:existingTransaction
                })
            }
            if(existingTransaction.status === "Failed"){
                return res.status(200).json({
                    message:"Transaction already failed",
                    transaction:existingTransaction
                })
            }
            if(existingTransaction.status === "Reversed"){
                return res.status(200).json({
                    message:"Transaction already reversed",
                    transaction:existingTransaction
                })
            }
        }
        if(fromAccount.status !== "Active" || toAccount.status !== "Active"){
            return res.status(400).json({
                message:"One or both accounts are not active"
            })
        }
        if(fromAccount._id.toString() === toAccount._id.toString()){
             res.status(400).json({
                message:"Cannot transfer to the same account"
            })
        }
        if(amount <= 0){
            return res.status(400).json({
                message:"Amount must be greater than zero"
            })
        }
        const fromAcccountBalance = await fromAccount.getBalance();
        if(fromAccountBalance < amount){
            return res.status(400).json({
                message:"Insufficient balance in source account"
            })
        }
        const session = await Transaction.startSession();
        session.startTransaction();
        try{

        }
        catch(error){
            
        }
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