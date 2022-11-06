import { dockStart } from "@nlpjs/basic";

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
  return nlp;
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
  return { intent, entities, answer };
};
