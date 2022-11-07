import { Router } from "express";
import { getNLUResponse } from "../nlu";
import { logSession } from "../middleware/analysis";

const router = Router();

router.use(logSession);

router.post("/", async (req, res) => {
  const message = req.body.message || req.query.message;
  if (!message) {
    res.status(402).send({ message: "No message provided" });
    return;
  }
  const session_id = req.body.session_id || req.query.session_id;
  if (!session_id) {
    res.status(402).send({ message: "No session_id provided" });
    return;
  }
  const response = await getNLUResponse(message);
  const toSend = {
    message,
    session_id,
    ...response,
  };

  res.send(toSend);
});

export default router;
