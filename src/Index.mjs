import express from "express";
import helmet from "helmet";
import cors from "cors";
import bodyParser from "body-parser";
const { json } = bodyParser;

import accountRoutes from "./Routes/AccountRoutes.mjs";
import expenseRoutes from "./Routes/ExpenseRoutes.mjs";

const app = express();

app.use(helmet());
app.use(cors());
app.use(json());

app.use("/qbt/api/account", accountRoutes);
app.use("/qbt/api/expenses", expenseRoutes);

export default app;
