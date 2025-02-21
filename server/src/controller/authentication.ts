import { NextFunction, Request, Response } from "express";

import UserModel from "../models/users"
import createError from 'http-errors'

import authModule from "../middlewares/authentication"


const login = async (req: Request, res: Response, next: NextFunction) : Promise<any> => {
    try {
        const {email, password} = req.body;

        if(!email || password)
            throw createError.NotAcceptable("Sufficient data not provided");

        const user = await UserModel.findOne({email});

        if(!user)
            throw createError.NotFound("User not found");

        const validation = await user.isValidPassword(password);

        if(!validation)
            throw createError.Unauthorized("Invalid Password");

        const token = await authModule.signAccessToken(user.email, user.role);

        res.status(200).json({token});

    } catch (error) {
        next(error);
    }
}

export {login}