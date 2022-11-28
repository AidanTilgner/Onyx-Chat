import type { Request } from "express";

export const getRequesterInfo = (req: Request) => {
  // get things like ip, user agent, etc.
  // return an object with the info

  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const userAgent = req.headers["user-agent"];
  const session_id = req.body.session_id || req.query.session_id;

  return {
    ip,
    userAgent,
    session_id,
  };
};
