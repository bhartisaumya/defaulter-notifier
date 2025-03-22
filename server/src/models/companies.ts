import {Schema, ObjectId, model} from "mongoose"


const CompanySchema = new Schema({
    name: {type: String, lowercase: true, unique: true, required: true},
    address: {type: String},
    credit: {type: Number, default: 0}
})

const CompanyModel = model('companies', CompanySchema)

export default CompanyModel;