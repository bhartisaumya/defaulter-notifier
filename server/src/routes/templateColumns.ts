import { Router } from "express";
import {createOrUpdateTemplateColumns, getTemplateColumns, } from "../controller/templateColumns";

import {restrictTo} from "../middlewares/authentication";
import { Roles } from "../interface";

const router = Router();

router.get("/", restrictTo([Roles.ADMIN, Roles.USER]), getTemplateColumns);
router.patch("/", restrictTo([Roles.ADMIN, Roles.USER]), createOrUpdateTemplateColumns);

export default router;