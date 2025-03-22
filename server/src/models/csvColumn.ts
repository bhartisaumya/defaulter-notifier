import {Schema, model} from "mongoose"


const ColumnSchema = new Schema({
    company: {type: String, required: true},
    defaulter_phone: {type: String},
    guarantor_phone1: {type: String},
    guarantor_phone2: {type: String}
})


const ColumnModel = model('csv_column', ColumnSchema)

export default ColumnModel;