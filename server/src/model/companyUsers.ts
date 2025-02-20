import {Schema, model, Types} from "mongoose"


const enumType = {
    values: ['admin', 'user'],
}

const CompanyUsersSchema = new Schema({
    email: {type: String, unique: true, required: true},
    name: {type: String, required: true},
    password: {type: String, required: true},
    company_id: {type: Types.ObjectId, required: true},
    type: {type: enumType, required: true}
})


const CompanyUsersModel = model('companyUsers', CompanyUsersSchema)

export default CompanyUsersModel;