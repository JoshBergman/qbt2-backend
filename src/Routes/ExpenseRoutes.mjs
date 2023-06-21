import { Router } from "express";

import setExpenses from "../Controllers/Expenses/SetExpenses.mjs";
import getExpenses from "../Controllers/Expenses/GetExpenses.mjs";

const router = Router();

router.get("/get", getExpenses);

router.post("/set", setExpenses);

export default router;
