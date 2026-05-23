import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import aiRouter from "./routes/ai.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

app.use(cors());
app.use(json());
app.use("/", aiRouter);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
