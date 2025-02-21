import jwt from 'jsonwebtoken'

import createError from 'http-errors'
import dotenv from "dotenv"
dotenv.config()

const authModule = {
    signAccessToken: function (email: string, role: string){
        return new Promise((resolve, reject) => {
            const payload = {
                audience: email,
                role: role,
            };
            const secret = process.env.ACCESS_TOKEN_SECRET || "super Secret key";
            const options = {
                
                expiresIn: 3600, // 1 hour in seconds
                issuer: 'bhartiking.com'
            };
            jwt.sign(payload, secret, options, (err, token) => {
                if(err)
                    return reject(err)
                resolve(token)
            })
        })
    },

    
    verifyAccessToken: function(req: any, res: any, next: any){
        const authHeader = req.headers['authorization'];

        // console.log(authHeader);
        
        if(!authHeader)
            return next(createError.Unauthorized());

        const bearerToken = authHeader.split(' ');
        const token = bearerToken[1];

        console.log(token)
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || "super Secret key", (err: any, payload: any) => {
            if(err){
                const message = err.name == "JsonWebTokenError" ?
                         "Unauthorized" : err.message;

                return next(createError.Unauthorized(message));
            }
            
            req.role = payload.aud;
            req.role = payload.role;
            next();
        })
    },

    // restrictTo: function(roles: string[]){
    //     return (req: any, res: any, next: any) => {
    //         if(!roles.includes(req.role))
    //             return next(createError.Forbidden("You do not have permission to perform this action"));
    //         next();
    //     }
    // }
}

const restrictTo = (roles: string[]) => {
    return (req: any, res: any, next: any) => {
        if(!roles.includes(req.role))
            return next(createError.Forbidden("You do not have permission to perform this action"));
        next();
    }
}

export default authModule;

export {restrictTo}