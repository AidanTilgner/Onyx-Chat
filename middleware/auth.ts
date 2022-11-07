import type { Request, Response, NextFunction } from "express";
import { config } from "dotenv";
import { Logger } from "../utils/logger";
import { sendWarningEmail } from "../utils/email";

config();

const logger = new Logger({
  log_type: "warning",
});

const API_KEYS = JSON.parse(process.env.API_KEYS || `[{"porfolio": "test"}]"`);

export const checkAPIKey = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const key =
    req.headers["x-api-key"] ||
    req.query["x-api-key"] ||
    req.headers["authorization"]?.split(" ")?.[1];
  if (!key) {
    res.status(401).send({ message: "No API key provided" });
    sendWarningEmail("An unauthorized request was made");
    logger.log("An unauthorized request was made");
    return;
  }
  const keyObj = API_KEYS.find((k: any) => k.key === key);
  if (!keyObj) {
    logger.log("Invalid API key provided");
    sendWarningEmail("Invalid API key provided");
    res.status(401).send({ message: "Invalid API key provided" });
    return;
  }
  next();
};
