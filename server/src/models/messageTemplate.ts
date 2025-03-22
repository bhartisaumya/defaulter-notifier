import {Schema, model} from "mongoose"


const TemplateSchema = new Schema({
    title: {type: String, required: true},
    body: {type: String, required: true},
    company: {type: String, required: true}
})


const TemplateModel = model('templates', TemplateSchema)

export default TemplateModel;