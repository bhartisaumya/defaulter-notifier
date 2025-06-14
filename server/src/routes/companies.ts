import { Router } from "express";
import {getCompanies, addNewCompany, updateCompany, deleteCompany, sendMessage, getMetaTemplates} from "../controller/companies";
import { restrictTo } from "../middlewares/authentication";
import { Roles } from "../interface";

const router = Router();

router.get("/", getCompanies);
router.post("/", restrictTo([Roles.SUPER_ADMIN]), addNewCompany);
router.patch("/", restrictTo([Roles.SUPER_ADMIN]), updateCompany);
router.delete("/", restrictTo([Roles.SUPER_ADMIN]), deleteCompany);

router.patch("/send-message", restrictTo([Roles.ADMIN, Roles.USER]), sendMessage);
router.get("/get-templates", restrictTo([Roles.ADMIN, Roles.USER]), getMetaTemplates);


export default router;