import { config } from "dotenv";
import { onyxCore } from "../utils/axios";
import default_corpus from "./documents/default_corpus.json";

config();

export const activateTrigger = async (actionString: string) => {
  const { data } = await onyxCore.post(`/trigger/${actionString}`, {
    action: actionString,
  });
  return data;
};

export const detectAndActivateTrigger = async (intent: string) => {};
