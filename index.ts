import Express from "express";
import { config } from "dotenv";
import NLURouter from "./routes/nlu";
import ChatRouter from "./routes/chat";
import TrainingRouter from "./routes/training";
import { train } from "./nlu/index";
import { logIP } from "./middleware/analysis";
import { checkAPIKey } from "./middleware/auth";
import path from "path";

config();
train();

const app = Express();

app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));

app.use(Express.static(path.join(__dirname, "public", "default")));
if (process.env.NODE_ENV === "development") {
  app.use("/train", Express.static(path.join(__dirname, "public", "training")));
  app.use(
    "/train_new",
    Express.static(path.join(__dirname, "public", "training_new"))
  );
}
app.use(logIP);
app.use(checkAPIKey);

app.get("/", (req, res) => {
  res.send({
    message: "Use the /nlu or /chat endpoints to interact",
  });
});

app.use("/nlu", NLURouter);
app.use("/chat", ChatRouter);
app.use("/training", TrainingRouter);

app.listen(process.env.PORT, () => {
  console.info(`Server is running on port ${process.env.PORT}`);
});
