import { dockStart } from "@nlpjs/basic";
import { writeIntentsToFile } from "./metadata";
import { extractAttachments } from "./attachments";

export let manager;

export const train = async () => {
  const dock = await dockStart({
    settings: {
      nlp: {
        corpora: ["nlu/documents/default_corpus.json"],
      },
    },
    use: ["Basic"],
  });
  // Add the NLU here
  const nlp = dock.get("nlp");
  //   await nlp.addCorpus("./nlu/documents/default_corpus.json");
  await nlp.train();
  manager = nlp;
  writeIntentsToFile();
  return nlp;
};

export const retrain = async () => {
  try {
    await train();
    return 1;
  } catch (err) {
    console.error(err);
    return 0;
  }
};

export const getRawResponse = async (text: string) => {
  const response = await manager.process("en", text);
  return response;
};

export const getNLUResponse = async (text: string) => {
  const response = await getRawResponse(text);
  const intent = response.intent;
  const entities = response.entities;
  const answer = response.answer;
  const attachments = await extractAttachments(answer);
  return { intent, entities, answer, attachments };
};
