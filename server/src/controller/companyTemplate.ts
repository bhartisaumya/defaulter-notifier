import { NextFunction, Request, Response } from "express";

import TemplateModel from "../models/messageTemplate";
import createError from 'http-errors'
import authModule from "../middlewares/authentication"


const getTemplate = async (req: Request, res: Response, next: NextFunction) : Promise<any> => {
  try {
    const company = req.query.company
    console.log(company)

    const templates = await TemplateModel.find({company});

    if (!templates)
      throw createError.NotFound("Template not found");

    res.status(200).json(templates);
  } catch (error) {
    next(error);
  }
}


const addNewTemplate = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const {title, body, company} = req.body

    const template = await TemplateModel.findOne
    ({title, company});

    if(template)
      throw createError.Conflict("Template already exists");

    const newTemplate = new TemplateModel({title, body, company});
    newTemplate.save();
    
    res.status(201).json({message: "Template added successfully"});
  } catch (error) {
    next(error)
  }
}

const deleteTemplate = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const {_id} = req.body;
    const template = await TemplateModel.findByIdAndDelete(_id);

    if(!template)
      throw createError.NotFound("Template not found");

    res.status(200).json({message: "Template deleted successfully"});
  } catch (error) {
    next(error)
  }
}


const updateTemplate = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const _id = req.query._id
    console.log(_id)
    const {title, body, company} = req.body;
    const template = await TemplateModel.findByIdAndUpdate
    (_id, {title, body, company});

    if(!template)
      throw createError.NotFound("Template not found");

    res.status(200).json({message: "Template updated successfully"});
  } catch (error) {
    next(error)
  }
}


export{
    getTemplate,
    addNewTemplate,
    deleteTemplate,
    updateTemplate
}