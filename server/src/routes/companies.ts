import { Router } from "express";
import {getCompanies, addNewCompany, updateCompany, deleteCompany} from "../controller/companies";

const router = Router();

router.get("/", getCompanies);
router.post("/", addNewCompany);
router.patch("/", updateCompany);
router.delete("/", deleteCompany);


export default router;