import type { Request, Response, NextFunction } from "express";
import { Logger } from "../utils/logger";

const anaylisLogger = new Logger({
  log_file_path: "storage/analytics/analysis.txt",
});

export const logIP = (req: Request, res: Response, next: NextFunction) => {
  const ip = req.headers["x-forwarded-for"] || req.ip;
  anaylisLogger.analytics(`request from ip: ${ip}`);
  next();
};

export const logSession = (req: Request, res: Response, next: NextFunction) => {
  const session_id = req.body.session_id || req.query.session_id;
  anaylisLogger.analytics(`request from session: ${session_id}`);
  next();
};
