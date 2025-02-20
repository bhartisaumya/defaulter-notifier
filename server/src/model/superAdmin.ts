import {Schema, model} from "mongoose"


const SuperAdminSchema = new Schema({
    email: {type: String, unique: true, required: true},
    name: {type: String, required: true},
    password: {type: String, required: true}
})


const SuperAdminModel = model('superAdmin', SuperAdminSchema)

export default SuperAdminModel;