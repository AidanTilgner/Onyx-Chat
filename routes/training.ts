import {
  addData,
  addOrUpdateUtteranceOnIntent,
  addResponseToIntent,
  addUtteranceToIntent,
  removeResponseFromIntent,
  removeUtteranceFromIntent,
} from "../nlu/training";
import { Router } from "express";
import { retrain, getNLUResponse } from "../nlu";
import { getDataForIntent, getIntents } from "../nlu/metadata";

const router = Router();

router.post("/say", async (req, res) => {
  const text = req.body.text || req.query.text;
  const response = await getNLUResponse(text);
  const intentData = getDataForIntent(response.intent);
  const shouldRetrain = req.body.retrain || req.query.retrain;
  const retrained = shouldRetrain ? await retrain() : false;

  const toSend = {
    message: "Got response",
    success: true,
    retrained: retrained,
    data: { ...response, intent_data: intentData },
  };

  res.json(toSend);
});

router.post("/datapoint", async (req, res) => {
  try {
    const { data: newData } = await addData(req.body);
    const shouldRetrain = req.body.retrain || req.query.retrain;
    const retrained = shouldRetrain ? await retrain() : false;
    const toSend = {
      message: "Data added",
      data: newData,
      retrained,
      success: true,
    };
    res.send(toSend);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error adding data" });
  }
});

router.post("/retrain", async (req, res) => {
  try {
    const result = await retrain();
    const toSend = {
      message: "Retrained",
      data: result,
      success: true,
    };
    res.send(toSend);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Error retraining" });
  }
});

router.get("/intent/:intent", async (req, res) => {
  const data = getDataForIntent(req.params.intent);
  const toSend = {
    message: "Data for intent",
    success: true,
    data,
  };

  res.send(toSend);
});

router.put("/intent", async (req, res) => {
  const { old_intent, new_intent, utterance } = req.body;
  const data = await addOrUpdateUtteranceOnIntent(
    old_intent,
    new_intent,
    utterance
  );

  const shouldRetrain = req.body.retrain || req.query.retrain;
  console.log("Retraining: ", shouldRetrain);
  const retrained = shouldRetrain ? await retrain() : false;

  const toSend = {
    message: "Intent updated",
    success: true,
    data,
    retrained,
  };

  res.send(toSend);
});

router.get("/intents", async (req, res) => {
  const intents = getIntents();
  const toSend = {
    message: "Got intents",
    success: true,
    data: intents,
  };
  res.send(toSend);
});

router.delete("/response", async (req, res) => {
  const { intent, answer } = req.body;
  const data = await removeResponseFromIntent(intent, answer);
  const shouldRetrain = req.body.retrain || req.query.retrain;
  const retrained = shouldRetrain ? await retrain() : false;
  const toSend = {
    message: "Response removed",
    success: true,
    data,
    retrained,
  };

  res.send(toSend);
});

router.put("/response", async (req, res) => {
  const { intent, answer } = req.body;
  const data = await addResponseToIntent(intent, answer);
  const shouldRetrain = req.body.retrain || req.query.retrain;
  const retrained = shouldRetrain ? await retrain() : false;
  const toSend = {
    message: "Responses added",
    success: true,
    data,
    retrained,
  };

  res.send(toSend);
});

router.delete("/utterance", async (req, res) => {
  const { intent, utterance } = req.body;
  const data = await removeUtteranceFromIntent(intent, utterance);
  const shouldRetrain = req.body.retrain || req.query.retrain;
  const retrained = shouldRetrain ? await retrain() : false;
  const toSend = {
    message: "Utterance removed",
    success: true,
    data,
    retrained,
  };
  res.send(toSend);
});

router.put("/utterance", async (req, res) => {
  const { intent, utterance } = req.body;
  const data = await addUtteranceToIntent(intent, utterance);
  const shouldRetrain = req.body.retrain || req.query.retrain;
  const retrained = shouldRetrain ? await retrain() : false;
  const toSend = {
    message: "Utterance added",
    success: true,
    data,
    retrained,
  };
  res.send(toSend);
});

export default router;
