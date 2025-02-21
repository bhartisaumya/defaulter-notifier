import { NextFunction, Request, Response } from "express";
import UsersModel, {Role} from "../models/users";
import CompanyUsers from "../models/companyUsers";
import createError from 'http-errors'
import authModule from "../middlewares/authentication"
import { Types } from "mongoose";

// const login = async (req: Request, res: Response, next: NextFunction) : Promise<any> => {
//   try {
//     const {email, password} = req.body;
    
//     // if the details not present
//     if (!email || !password)
//       throw createError.NotAcceptable("Sufficient data not provided");

//     const isUser = await CompanyUsers.findOne({email});

//     if (!isUser)
//       throw createError.NotFound("Sufficient data not provided");

//     const validation = await isUser.isValidPassword(password);


//     if(!validation)
//       throw createError.Unauthorized("Invalud Password");

//     const token = await authModule.signAccessToken(isUser.email, isUser.role);

//     res.status(200).json({token});
//   } catch (error) {
//     next(error);
//   }
// }


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
    const {email, name, password, company_id, admin} = req.body

    const user = await UsersModel.findOne({email});

    if(user)
      throw createError.Conflict("Email already registered");

    const companyId = new Types.ObjectId(company_id);

    const company = await CompanyUsers.findOne({_id: companyId});

    if(!company)
      throw createError.NotFound("Company not found");

    const role = admin ? Role.ADMIN : Role.USER;

    const newUser = new UsersModel({email, name, password, role});
    const savedUser = await newUser.save();

    const newCompanyUser = new CompanyUsers({user_id: savedUser.id, company_id: companyId});
    await newCompanyUser.save();


    res.status(201).json({message: "User added successfully"});

  } catch (error) {
    next(error)
  }
}

const updateCompanyUser = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const {email, name, password, company_id, admin} = req.body;
    const role = admin ? Role.ADMIN : Role.USER;

    const user = await CompanyUsers.findOneAndUpdate({email}, {name, password, role});

    if(!user)
      throw createError.NotFound("User not found");

    await CompanyUsers.findOneAndUpdate({user_id: user._id}, {company_id});

    res.status(200).json({message: "User updated successfully"});
  } catch (error) {
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

    await CompanyUsers.findOneAndDelete({user_id: user._id});
    
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
