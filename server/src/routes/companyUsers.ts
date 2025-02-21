import { Router } from "express";
import {getAllUsers, addNewCompanyUser, updateCompanyUser, deleteCompanyUser} from "../controller/companyUsers";

const router = Router();

router.get("/", getAllUsers);
router.post("/", addNewCompanyUser);
router.patch("/", updateCompanyUser);
router.delete("/", deleteCompanyUser);


export default router;