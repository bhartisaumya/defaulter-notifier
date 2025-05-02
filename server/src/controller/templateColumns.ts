import { NextFunction, Request, Response } from "express";

import TemplateModel from "../models/messageTemplate";
import createError from 'http-errors'
import ColumnModel from "../models/csvColumn";
import { ObjectId } from "bson";


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



const createOrUpdateTemplateColumns = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const company = req.query.company;

    const {
      borrower,
      co_borrower,
      guarantor_1,
      guarantor_2,
      guarantor_3,
      pdfNameColumn
    } = req.body;

    if (!company) {
      throw createError.BadRequest("Company is required");
    }

    let column = await ColumnModel.findOne({ company });

    if (column) {
      // Update existing document
      column.borrower = borrower;
      column.co_borrower = co_borrower;
      column.guarantor_1 = guarantor_1;
      column.guarantor_2 = guarantor_2;
      column.guarantor_3 = guarantor_3;
      column.pdfNameColumn = pdfNameColumn;

      await column.save();
      res.status(200).json({ message: "Column updated successfully" });
    } else {
      // Create new document
      column = new ColumnModel({
        company,
        borrower,
        co_borrower,
        guarantor_1,
        guarantor_2,
        guarantor_3,
        pdfNameColumn
      });

      await column.save();
      res.status(201).json({ message: "Column created successfully" });
    }
  } catch (error) {
    next(error);
  }
};


export{
    getTemplateColumns,
    createOrUpdateTemplateColumns
}