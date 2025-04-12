import { Router } from "express";
import { restrictTo } from "../middlewares/authentication";
import { Roles } from "../interface";
import { addTransaction, getCompanyTransactions } from "../controller/tokenTransactions";

const router = Router();

router.post("/", restrictTo([Roles.SUPER_ADMIN]), addTransaction);
router.get("/",  restrictTo([Roles.SUPER_ADMIN]), getCompanyTransactions)

export default router;