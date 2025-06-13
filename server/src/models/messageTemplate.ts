import {Schema, model} from "mongoose"


const TemplateSchema = new Schema({
    title: {type: String, required: true},
    body: {type: String, required: true},
    company: {type: String, required: true},
    metaTemplateId : {type: String, required: false},
    json: { type: Schema.Types.Mixed, required: false },
})


const TemplateModel = model('templates', TemplateSchema)

export default TemplateModel;