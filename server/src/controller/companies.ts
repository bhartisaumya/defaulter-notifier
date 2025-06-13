import { NextFunction, Request, Response } from "express";

import CompanyModel from "../models/companies"
import createError from 'http-errors'
import UserModel from "../models/users";
import TemplateModel from "../models/messageTemplate";
import { ObjectId } from "bson";
import axios from 'axios';


const getCompanies = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const company = req.query.company?.toString().trim(); // Ensure it's a string and remove whitespace

    if (company) {
      const gotCompany = await CompanyModel.findOne({ _id: new ObjectId(company) });

      if (!gotCompany) {
        res.status(404).json({ message: "Company not found" });
        return
      }

      res.status(200).json(gotCompany);
      return
    }

    const companies = await CompanyModel.find();
    res.status(200).json(companies);
  } catch (error) {
    next(error);
  }
};


const addNewCompany = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const {name, address, legalName, credit, letterHead} = req.body

    const company = await CompanyModel.findOne({name})

    if(company)
      throw createError.Conflict("Company already exists");

    const newCompany = new CompanyModel({name, address, legalName, credit, letterHead});
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
    console.log(req.body)
    const {name, address, credit, legalName, letterHead, whatsappToken, waba} = req.body

    const unalteredCompany = await CompanyModel.findByIdAndUpdate(_id, {name, address, credit, legalName, letterHead, whatsappToken, waba})

    if(!unalteredCompany)
      throw createError.NotFound("Company not found");

    if(name){
      UserModel.updateMany(
        {company: unalteredCompany.name},
        {company: name}
      )

      TemplateModel.updateMany(
        {company: unalteredCompany.name},
        {company: name}
      )
    }

    res.status(200).json({message: "Company Successfully updated"});
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

const getMetaTemplates = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const companyId = req.query.id?.toString().trim();
    console.log(companyId)
    const company = await CompanyModel.findOne({ _id: new ObjectId(companyId) });

      if (!company) {
        throw createError.NotFound("Company not found");
      }
 
      const metaTemplates = await axios.get(`https://partnersv1.pinbot.ai/v3/${company.waba}/message_templates`,{
        headers: {
          apikey: company.whatsappToken,
        }})
        if(!metaTemplates){
           res.status(400).json({message: "Error in retreiving meta templates"})
        }

       res.status(200).json(metaTemplates.data);
  } catch (error) {
      next(error)
  }
}

export{
    getMetaTemplates,
    getCompanies,
    addNewCompany,
    updateCompany,
    deleteCompany,
    sendMessage
}