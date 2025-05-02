
import { NextFunction, Request, Response } from "express";
import CompanyModel from "../models/companies";
import { ObjectId } from "bson";
import TokenTransactionModel from "../models/tokenTransaction";

const addTransaction = async (req: Request, res: Response, next: NextFunction) => {
    
    try {
        const {companyId, amount, justification} = req.body
        console.log(req.body)
        if(!companyId || !amount || !justification){
            res.status(400).json({message : "Bad request"})
            return
        }

        const gotCompany = await CompanyModel.findOne({ _id: new ObjectId(companyId) });

        if(!gotCompany){
            res.status(400).json({message : "Company not found"})
            return
        }
        gotCompany.credit += amount;
        await gotCompany.save();

        const newTransaction = new TokenTransactionModel({companyId, amount: amount, justification: justification});
        await newTransaction.save();
        res.status(201).json({"message": "Transaction added successfuly"})

    } catch (error) {
        next(error)
    }

}
const getCompanyTransactions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const  companyId  = req.query.company;
        console.log(companyId)
        if (!companyId) {
            res.status(400).json({ message: "Bad request: companyId is required" });
            return;
        }

        const gotCompany = await CompanyModel.findOne({ _id: new ObjectId(companyId as string) });

        if (!gotCompany) {
            res.status(404).json({ message: "Company not found" });
            return;
        }

        const transactions = await TokenTransactionModel.find({ companyId: companyId }).sort({ createdAt: -1 });

        res.status(200).json({ transactions });

    } catch (error) {
        next(error);
    }
};




export{
    addTransaction,
    getCompanyTransactions
}