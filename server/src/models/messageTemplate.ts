import {Schema, model, Types} from "mongoose"


const TemplateSchema = new Schema({
    title: {type: String, required: true},
    body: {type: String, required: true},
    company_id: {type: Types.ObjectId, required: true}
})


const TemplateModel = model('templates', TemplateSchema)

export default TemplateModel;