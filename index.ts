import Express from "express";
import { config } from "dotenv";
import cors from "cors";
import NLURouter from "./routes/nlu";
import { train } from "./nlu/index";
import { logIP } from "./middleware/analysis";

config();
train();

const app = Express();

const origins = process.env.ORIGINS?.split(",") || [];

app.use(cors({ origin: origins }));

app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));
app.use(logIP);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/nlu", NLURouter);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
