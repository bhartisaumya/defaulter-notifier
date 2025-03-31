import express, {Request, Response, NextFunction, json} from "express"
import cors from 'cors';

import "./utils/dbConnection"
const app = express();
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended : true}));

import {Data} from "./config"

import companyUsers from "./routes/companyUsers"
import companies from "./routes/companies"
import companyTemplate from "./routes/companyTemplate"
import templateColumns from "./routes/templateColumns"

import authHandler, {restrictTo} from "./middlewares/authentication"
import {login} from "./controller/authentication"
import { Roles } from "./interface";
import { addSuperAdmin } from "./temp";






// app.use('/', (req: Request, res: Response, next: NextFunction) => {
//     res.json({
//         message: "Server is healthy!!!"
//     });
// })

app.use('/add-super-admin', addSuperAdmin)
app.use('/auth', login)
// for authentication
app.use(authHandler.verifyAccessToken)




app.use('/company-users', companyUsers)
app.use('/companies', companies)
app.use('/templates', companyTemplate)
app.use('/template-columns', templateColumns)



// Error Handling
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    res.status(err.status || 500)
    res.json({
        error: {
            status: err.status,
            message: err.message
        }
    })
})


const PORT = Data.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
})