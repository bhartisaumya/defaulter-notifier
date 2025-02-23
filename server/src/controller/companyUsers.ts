import { NextFunction, Request, Response } from "express";
import UsersModel, {Role} from "../models/users";
import CompanyUsers from "../models/companyUsers";
import createError from 'http-errors'
import authModule from "../middlewares/authentication"
import { Types } from "mongoose";
import CompanyModel from "../models/companies";
import SuperAdminModel from "../models/superAdmin";

const getAllUsers = async (req: Request, res: Response, next: NextFunction) : Promise<any> => {
  try {
    const users = await UsersModel.find();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
}


const addNewCompanyUser = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const {email, name, password, company, role} = req.body

    const user = await UsersModel.findOne({email});
    const superAdmin = await SuperAdminModel.findOne({email})

    if(user || superAdmin)
      throw createError.Conflict("Email already registered");


    const userCompany = await CompanyModel.findOne({company});

    if(!userCompany)
      throw createError.NotFound("Company not found");


    const newUser = new UsersModel({email, name, password, role, company});
    await newUser.save();

    res.status(201).json({message: "User added successfully"});

  } catch (error) {
    next(error)
  }
}

const updateCompanyUser = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.query.id as string
    console.log("id", id)
    const {email, name, password, company, admin} = req.body;
    const role = admin ? Role.ADMIN : Role.USER;


    const isCompany = CompanyModel.findOne({company})

    if(!isCompany)
      throw createError.NotFound("Company not found");

    const user = await UsersModel.findByIdAndUpdate(id, {email, name, password, role, company});

    if(!user)
      throw createError.NotFound("User not found");

    res.status(200).json({message: "User updated successfully"});
  } catch (error) {
    console.log(error)
    next(error)
  }
}


const deleteCompanyUser = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const {email} = req.body; 

    if(!email)
      throw createError.BadRequest("Email not provided");

    const user = await UsersModel.findOneAndDelete({email});
    
    if(!user)
      throw createError.NotFound("User not found");

    res.status(200).json({message: "User deleted successfully"});
  } catch (error) {
    next(error)
  }
}


export{
  getAllUsers,
  addNewCompanyUser,
  updateCompanyUser,
  deleteCompanyUser
}
