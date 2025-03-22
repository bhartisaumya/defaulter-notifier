import { NextFunction, Request, Response } from "express";

import CompanyModel from "../models/companies"
import createError from 'http-errors'


const getCompanies = async (req: Request, res: Response, next: NextFunction) : Promise<any> => {
  try {
    const company = req.query.company

    if(company){
      const gotCompany = await CompanyModel.findOne({name: company});

      res.status(200).json(gotCompany)

      if (!company)
        throw createError.NotFound("Companies not found");
    }

    const companies = await CompanyModel.find()    

    res.status(200).json(companies);
  } catch (error) {
    next(error);
  }
}


const addNewCompany = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const {name, address} = req.body

    const company = await CompanyModel.findOne({name})

    if(company)
      throw createError.Conflict("Company already exists");

    const newCompany = new CompanyModel({name, address});
    await newCompany.save();
    
    res.status(201).json({message: "Company added successfully"});
  } catch (error) {
    next(error)
  }
}

const deleteCompany = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const {_id} = req.query

    const deletedCompany = await CompanyModel.findByIdAndDelete(_id)

    if(!deletedCompany)
      throw createError.NotFound("Company not found");

    res.status(200).json({message: "Successfully deleted"});
  } catch (error) {
    next(error)
  }

}

const updateCompany = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const _id = req.query.id as string
    const {name, address, credit} = req.body

    const updatedCompany = await CompanyModel.findByIdAndUpdate(_id, {name, address, credit})

    if(!updatedCompany)
      throw createError.NotFound("Company not found");

    res.status(200).json({message: "Successfully updated"});
  } catch (error) {
    next(error)
  }
}

const sendMessage = async(req: Request, res: Response, next: NextFunction) => {
  try {
      const company = req.query.company as string;

      if (!company) {
        throw createError.BadRequest("Company name is required");
      }

      const companyDetails = await CompanyModel.findOne({ name: company.toLowerCase() });

      if (!companyDetails) {
        throw createError.NotFound("Company not found");
      }

      if (companyDetails.credit <= 0) {
        throw createError.BadRequest("Insufficient credit");
      }

      // Decrement credit by 1
      companyDetails.credit -= 1;
      await companyDetails.save();

      res.status(200).json({ message: "Sufficient credit", remainingCredit: companyDetails.credit });
  } catch (error) {
      next(error)
  }
}


export{
    getCompanies,
    addNewCompany,
    updateCompany,
    deleteCompany,
    sendMessage
}