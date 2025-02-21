import {Schema, model, Types} from "mongoose"

interface ICompanyUser extends Document {
    user_id: Schema.Types.ObjectId;
    company_id: Schema.Types.ObjectId;
    isValidPassword(password: string): Promise<boolean>;
}

const CompanyUsersSchema = new Schema<ICompanyUser>({
    user_id: {type: Schema.Types.ObjectId, required: true, unique: true},
    company_id: {type: Schema.Types.ObjectId, required: true},
})


const CompanyUsersModel = model('company_users', CompanyUsersSchema)

export default CompanyUsersModel;