import type { Request, Response, NextFunction } from "express";
import { Logger } from "../utils/logger";

const anaylisLogger = new Logger({
  log_file_path: "storage/analysis.txt",
});

export const logIP = (req: Request, res: Response, next: NextFunction) => {
  const ip = req.headers["x-forwarded-for"] || req.ip;
  anaylisLogger.analytics(`request from ip: ${ip}`);
  next();
};
