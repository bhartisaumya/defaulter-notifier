import { Router } from "express";
import {getTemplate, addNewTemplate, deleteTemplate, updateTemplate} from "../controller/companyTemplate";

const router = Router();

router.get("/", getTemplate);
router.post("/", addNewTemplate);
router.patch("/", updateTemplate);
router.delete("/", deleteTemplate);


export default router;