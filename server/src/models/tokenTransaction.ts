import { ObjectId } from "bson"
import {Schema,  model} from "mongoose"

const TokenTransactionSchema = new Schema({
    companyId: {type: ObjectId, ref: 'companies', required: true},
    tokenAmount: {type: Number, required: true},
    justification: {type: String, required: true},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now} })
    

const TokenTransactionModel = model('tokenTransactions', TokenTransactionSchema)
export default TokenTransactionModel;