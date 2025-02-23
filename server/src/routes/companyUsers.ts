import { Router } from "express";
import {getAllUsers, addNewCompanyUser, updateCompanyUser, deleteCompanyUser} from "../controller/companyUsers";

import {restrictTo} from "../middlewares/authentication";
import { Roles } from "../interface";
const router = Router();

router.get("/", restrictTo([Roles.SUPER_ADMIN]), getAllUsers);
router.post("/", restrictTo([Roles.SUPER_ADMIN]), addNewCompanyUser);
router.patch("/", restrictTo([Roles.SUPER_ADMIN]), updateCompanyUser);
router.delete("/", restrictTo([Roles.SUPER_ADMIN]), deleteCompanyUser);


export default router;