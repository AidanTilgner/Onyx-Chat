import {
  addData,
  addResponseToIntent,
  removeResponseFromIntent,
} from "../nlu/training";
import { Router } from "express";
import { retrain } from "../nlu";
import { getDataForIntent } from "../nlu/metadata";

const router = Router();

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
      result,
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

router.delete("/response", (req, res) => {
  const { intent, response } = req.body;
  const data = removeResponseFromIntent(intent, response);
  const toSend = {
    message: "Response removed",
    success: true,
    data,
  };

  res.send(toSend);
});

router.put("/response", (req, res) => {
  const { intent, response } = req.body;
  const data = addResponseToIntent(intent, response);
  const toSend = {
    message: "Responses added",
    success: true,
    data,
  };

  res.send(toSend);
});

export default router;
