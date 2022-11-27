import default_corpus from "./documents/default_corpus.json";
import { writeFileSync } from "fs";
import { prettify_json } from "../utils/prettier";

export const addData = async (data: {
  intent: string;
  utterances: string[];
  answers: string[];
}) => {
  const corpusData = default_corpus.data;

  const existingIntent = corpusData.find(
    (intent) => intent.intent === data.intent
  );
  if (existingIntent) {
    existingIntent.utterances.push(...data.utterances);
    existingIntent.answers.push(...data.answers);
  } else {
    corpusData.push(data);
  }

  const newCorpus = {
    ...default_corpus,
    data: corpusData,
  };

  const formatted = prettify_json(JSON.stringify(newCorpus));

  writeFileSync("./nlu/documents/default_corpus.json", formatted);

  return newCorpus;
};
