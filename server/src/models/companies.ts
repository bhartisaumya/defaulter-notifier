import {Schema, ObjectId, model} from "mongoose"


const CompanySchema = new Schema({
    name: {type: String, lowercase: true, unique: true, required: true},
    address: {type: String},
    credit: {type: Number, default: 0},
    whatsappToken: {type: String, default: "", unique: true},
    waba : {type: String, default: "", unique: true},
    legalName: {type: String, unique : true, required: true},
    letterHead: {type: String, required: true},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
    

})

const CompanyModel = model('companies', CompanySchema)

export default CompanyModel;