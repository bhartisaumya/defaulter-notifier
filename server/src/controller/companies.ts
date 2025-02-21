import { NextFunction, Request, Response } from "express";

import CompanyModel from "../models/companies"
import createError from 'http-errors'


const getCompanies = async (req: Request, res: Response, next: NextFunction) : Promise<any> => {
  try {
    const companies = await CompanyModel.find();

    if (!companies)
      throw createError.NotFound("Companies not found");

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
    newCompany.save();
    
    res.status(201).json({message: "Company added successfully"});
  } catch (error) {
    next(error)
  }
}

const deleteCompany = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const {_id} = req.body

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
    const {_id, name, address} = req.body

    const updatedCompany = await CompanyModel.findByIdAndUpdate(_id, {name, address})

    if(!updatedCompany)
      throw createError.NotFound("Company not found");

    res.status(200).json({message: "Successfully updated"});
  } catch (error) {
    next(error)
  }

}


export{
    getCompanies,
    addNewCompany,
    updateCompany,
    deleteCompany
}