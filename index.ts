import Express from "express";
import { config } from "dotenv";
import NLURouter from "./routes/nlu";
import ChatRouter from "./routes/chat";
import { train } from "./nlu/index";
import { logIP } from "./middleware/analysis";
import { checkAPIKey } from "./middleware/auth";
import { getTestSession } from "./nlu/session";

config();
train();

if (process.env.NODE_ENV === "development") {
  (async () => {
    console.info("Creating test session");
    const [session, removeSession] = await getTestSession();
    session.addClient({
      user: {
        name: "Test User",
      },
    });
  })();
}

const app = Express();

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
  console.info(`Server is running on port ${process.env.PORT}`);
});
