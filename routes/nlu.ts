import { Router } from "express";
import { getFullNLUResponse } from "../nlu";
import { createSession } from "../nlu/session";

const router = Router();

router.post("/say", async (req, res) => {
  const text = req.body.text || req.query.text;
  const session_id =
    req.body.session_id ||
    req.query.session_id ||
    req.headers["x-session_id"] ||
    (await createSession());
  const response = await getFullNLUResponse(text, session_id);
  const toSend = {
    response,
    session_id,
  };
  res.send(toSend);
});

export default router;
