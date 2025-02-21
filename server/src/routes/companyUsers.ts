import { Router } from "express";
import {getAllUsers, addNewCompanyUser, updateCompanyUser, deleteCompanyUser} from "../controller/companyUsers";

import {restrictTo} from "../middlewares/authentication";
import { Role } from "../models/users";
const router = Router();

router.get("/", restrictTo([Role.SUPER_ADMIN]), getAllUsers);
router.post("/", restrictTo([Role.SUPER_ADMIN, Role.ADMIN]), addNewCompanyUser);
router.patch("/", restrictTo([Role.SUPER_ADMIN, Role.ADMIN]), updateCompanyUser);
router.delete("/", restrictTo([Role.SUPER_ADMIN, Role.ADMIN]), deleteCompanyUser);


export default router;