import { Router } from "express";
import { getNLUResponse } from "../nlu";
import { addIPToSession, logSession } from "../middleware/analysis";
import { detectAndActivateTriggers } from "../nlu/triggers";
import { config } from "dotenv";
import { createSession } from "../sessions";
import { getRequesterSessionId } from "../utils/analysis";

config();
const router = Router();

router.use(logSession);
router.use(addIPToSession);

router.post("/", async (req, res) => {
  const message = req.body.message || req.query.message;
  if (!message) {
    res.status(402).send({ message: "No message provided" });
    return;
  }
  const session_id = getRequesterSessionId(req) || createSession().id;

  const response = await getNLUResponse(message);
  const { intent } = response;
  detectAndActivateTriggers(intent, session_id);
  const toSend = {
    message,
    session_id,
    ...response,
  };

  res.send(toSend);
});

export default router;
