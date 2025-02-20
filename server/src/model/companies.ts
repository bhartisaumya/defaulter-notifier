import {Schema, ObjectId, model} from "mongoose"


const CompanySchema = new Schema({
    name: {type: String, required: true},
    address: {type: String}
})


const CompanyModel = model('companies', CompanySchema)

export default CompanyModel;