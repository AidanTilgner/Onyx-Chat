import default_corpus from "./documents/default_corpus.json";
import { writeFileSync } from "fs";

export const generateMetadata = async () => {
  writeIntentsToFile();
  writeTriggersToFile();
};

export const getIntents = () => {
  const intents = default_corpus.data.map((item) => item.intent);
  return intents;
};

export const getDataForIntent = (intent: string) => {
  const data = default_corpus.data.find((item) => item.intent === intent);
  return data;
};

export const getTriggers = () => {
  const triggers: {
    [key: string]: {
      type: string;
      args: { [key: string]: any };
    }[];
  } = {};
  default_corpus.data.forEach((item) => {
    if (item.triggers) {
      triggers[item.intent] = item.triggers;
    }
  });

  return triggers;
};

export const writeIntentsToFile = async () => {
  const intents = getIntents();

  writeFileSync(
    "./nlu/documents/intents.autogenerated.json",
    JSON.stringify(intents, null, 2)
  );
};

export const writeTriggersToFile = async () => {
  const triggers = getTriggers();

  writeFileSync(
    "./nlu/documents/triggers.autogenerated.json",
    JSON.stringify(triggers, null, 2)
  );
};
