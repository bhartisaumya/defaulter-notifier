import { Router } from "express";
import {getTemplate, addNewTemplate, deleteTemplate, updateTemplate} from "../controller/companyTemplate";

import {restrictTo} from "../middlewares/authentication";
import { Roles } from "../interface";

const router = Router();

router.get("/", restrictTo([Roles.ADMIN, Roles.USER]), getTemplate);
router.post("/", restrictTo([Roles.ADMIN]), addNewTemplate);
router.patch("/", restrictTo([Roles.ADMIN]), updateTemplate);
router.delete("/", restrictTo([Roles.ADMIN]), deleteTemplate);


export default router;