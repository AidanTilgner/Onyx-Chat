import Express from "express";
import { config } from "dotenv";
import cors from "cors";
import NLURouter from "./routes/nlu";
import ChatRouter from "./routes/chat";
import { train } from "./nlu/index";
import { logIP } from "./middleware/analysis";
import { checkAPIKey } from "./middleware/auth";

config();
train();

const app = Express();

const origins = process.env.ORIGINS?.split(",") || [];

app.use(cors({ origin: origins }));

app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));
app.use(logIP);
app.use(checkAPIKey);

app.get("/", (req, res) => {
  res.send({
    message: "Use the /nlu or /chat endpoints to interact",
  });
});

app.use("/nlu", NLURouter);
app.use("/chat", ChatRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
