import {Schema, model} from "mongoose"


const ColumnSchema = new Schema({
    company: {type: String, required: true},
    borrower: {type: String},
    co_borrower: {type: String},
    guarantor_1: {type: String},
    guarantor_2: {type: String},
    guarantor_3: {type: String},
    pdfNameColumn: {type: String}

})


const ColumnModel = model('csv_column', ColumnSchema)

export default ColumnModel;