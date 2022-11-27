import default_corpus from "./documents/default_corpus.json";
import { writeFileSync } from "fs";

export const getIntents = () => {
  const intents = default_corpus.data.map((item) => item.intent);
  return intents;
};

export const writeIntentsToFile = async () => {
  const intents = getIntents();

  writeFileSync(
    "./nlu/documents/intents.json",
    JSON.stringify(intents, null, 2)
  );
};

export const getDataForIntent = (intent: string) => {
  const data = default_corpus.data.find((item) => item.intent === intent);
  return data;
};
