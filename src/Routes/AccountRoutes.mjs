import { Router } from "express";

import newAccount from "../Controllers/Account/NewAccount/NewAccount.mjs";

const router = Router();

router.get("/test", (req, res, next) => {
  res.json({ error: false, msg: "Hello it may have worked finally." });
});

router.post("/new", newAccount);

export default router;
