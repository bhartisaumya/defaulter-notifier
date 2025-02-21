import { Router } from "express";
import {getTemplate, addNewTemplate, deleteTemplate, updateTemplate} from "../controller/companyTemplate";

import {restrictTo} from "../middlewares/authentication";
import { Role } from "../models/users";

const router = Router();

router.get("/", restrictTo([Role.ADMIN, Role.USER]), getTemplate);
router.post("/", restrictTo([Role.ADMIN]), addNewTemplate);
router.patch("/", restrictTo([Role.ADMIN]), updateTemplate);
router.delete("/", restrictTo([Role.ADMIN]), deleteTemplate);


export default router;