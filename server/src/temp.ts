import SuperAdminModel from "./models/superAdmin";
import { Request, Response, NextFunction } from "express";
import UserModel from "./models/users";

const addSuperAdmin = async(req: Request, res: Response, next: NextFunction) => {
    try {
      const {email, name, password} = req.body
  
      const newUser = new UserModel({email, name, password, role: "admin", company: "nil"});
      await newUser.save();

      res.status(201).json({message: "Super Admin added successfully"});
  
    } catch (error) {
      next(error)
    }
}

export {
    addSuperAdmin
}