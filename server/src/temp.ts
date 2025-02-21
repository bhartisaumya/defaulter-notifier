import CompanyUsersModel from "./models/companyUsers";
import UsersModel from "./models/users"
import { Request, Response, NextFunction } from "express";

const addSuperAdmin = async(req: Request, res: Response, next: NextFunction) => {
    try {
      const {email, name, password} = req.body
  
      const newUser = new UsersModel({email, name, password, role: "super_admin"});
      const savedUser = await newUser.save();

      res.status(201).json({message: "User added successfully"});
  
    } catch (error) {
      next(error)
    }
}

export {
    addSuperAdmin
}