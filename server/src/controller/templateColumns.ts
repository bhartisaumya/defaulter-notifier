import { NextFunction, Request, Response } from "express";

import TemplateModel from "../models/messageTemplate";
import createError from 'http-errors'
import ColumnModel from "../models/csvColumn";


const getTemplateColumns = async (req: Request, res: Response, next: NextFunction) : Promise<any> => {
  try {
    const company = req.query.company

    const columns = await ColumnModel.findOne({company});

    if (!columns)
      throw createError.NotFound("Columns not found");

    res.status(200).json(columns);
  } catch (error) {
    next(error);
  }
}



const updateTemplateColumns = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const _id = req.query._id
    console.log(_id)
    const {defaulter_name,
        defaulter_age,
        defaulter_phone,
        guarantor_name1,
        guarantor_phone1,
        guarantor_name2,
        guarantor_phone2,
        due_date1,
        due_date2
     } = req.body;


    console.log(defaulter_age)

     
    const column = await ColumnModel.findByIdAndUpdate
    (_id, {
        defaulter_name,
        defaulter_age,
        defaulter_phone,
        guarantor_name1,
        guarantor_phone1,
        guarantor_name2,
        guarantor_phone2,
        due_date1,
        due_date2
     });

    if(!column)
      throw createError.NotFound("Column not found");

    res.status(200).json({message: "Column updated successfully"});
  } catch (error) {
    next(error)
  }
}


export{
    getTemplateColumns,
    updateTemplateColumns
}