import { Router } from "express";

import newAccount from "../Controllers/Account/NewRem/NewAccount.mjs";
import remAccount from "../Controllers/Account/NewRem/RemAccount.mjs";
import changePassword from "../Controllers/Account/Manage/ChangePassword.mjs";

const router = Router();

router.post("/new", newAccount);

router.delete("/delete", remAccount);

router.patch("/password/reset", changePassword);

export default router;
