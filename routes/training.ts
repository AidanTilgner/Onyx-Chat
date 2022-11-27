import { addData } from "../nlu/training";
import { Router } from "express";

const router = Router();

router.post("/datapoint", async (req, res) => {
  try {
    const newData = await addData(req.body);
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

export default router;
