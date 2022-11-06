import Express from "express";
import { config } from "dotenv";
import cors from "cors";

config();

const app = Express();

const origins = process.env.ORIGINS?.split(",") || [];

app.use(cors({ origin: origins }));

app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
