import {
  addData,
  addResponseToIntent,
  removeResponseFromIntent,
} from "../nlu/training";
import { Router } from "express";
import { retrain, getNLUResponse } from "../nlu";
import { getDataForIntent, getIntents } from "../nlu/metadata";

const router = Router();

router.post("/say", async (req, res) => {
  const text = req.body.text || req.query.text;
  const response = await getNLUResponse(text);
  const intentData = getDataForIntent(response.intent);

  const toSend = {
    message: "Got response",
    data: { ...response, intent_data: intentData },
  };

  res.json(toSend);
});

router.post("/datapoint", async (req, res) => {
  try {
    const { data: newData } = await addData(req.body);
    const toSend = {
      message: "Data added",
      data: newData,
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
    data,
  };

  res.send(toSend);
});

router.delete("/response", async (req, res) => {
  const { intent, answer } = req.body;
  const data = await removeResponseFromIntent(intent, answer);
  const toSend = {
    message: "Response removed",
    success: true,
    data,
  };

  res.send(toSend);
});

router.put("/response", async (req, res) => {
  const { intent, answer } = req.body;
  const data = await addResponseToIntent(intent, answer);
  const toSend = {
    message: "Responses added",
    success: true,
    data,
  };

  res.send(toSend);
});

router.get("/intents", async (req, res) => {
  const intents = getIntents();
  const toSend = {
    message: "Got intents",
    intents,
  };
  res.send(toSend);
});

export default router;
