import { Router } from "express";

import newAccount from "../Controllers/Account/NewRem/NewAccount.mjs";
import remAccount from "../Controllers/Account/NewRem/RemAccount.mjs";

const router = Router();

router.get("/test", (req, res, next) => {
  res.json({ error: false, msg: "Hello it may have worked finally." });
});

router.post("/new", newAccount);

router.delete("/delete", remAccount);

export default router;
