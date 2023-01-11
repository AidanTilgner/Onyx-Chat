import axios from "axios";
import { showNotification } from "@mantine/notifications";

export const api = axios.create({
  baseURL: "/",
  withCredentials: true,
});

export const retrainModel = async () => {
  return await api
    .post("/training/retrain")
    .then((res) => {
      showNotification({
        title: "Success",
        message: "Model has been refreshed",
      });
      return res.data;
    })
    .catch((err) => {
      console.error(err);
      showNotification({
        title: "Error",
        message: "Something went wrong",
      });
      return err;
    });
};

export const getAnswer = async (text) => {
  return await api
    .post("/nlu/say", {
      text,
    })
    .then((res) => res.data)
    .catch((err) => {
      console.error(err);
      showNotification({
        title: "Error",
        message: "Something went wrong",
      });
      return err;
    });
};

export const getTrainingAnswer = async (text) => {
  return await api
    .post("/training/say", {
      text,
    })
    .then((res) => res.data)
    .catch((err) => {
      console.error(err);
      showNotification({
        title: "Error",
        message: "Something went wrong",
      });
      return err;
    });
};

export const addDataPoint = async ({ intent, utterances, answers }) => {
  return await api
    .post("/training/datapoint", {
      intent,
      utterances,
      answers,
    })
    .then((res) => {
      showNotification({
        title: "Success",
        message: "Data point added, model will be refreshed soon",
      });
      retrainModel();
      return res.data;
    })
    .catch((err) => {
      console.error(err);
      showNotification({
        title: "Error",
        message: "Something went wrong",
      });
      return err;
    });
};
