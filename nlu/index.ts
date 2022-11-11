import { dockStart } from "@nlpjs/basic";
import { BuiltinCompromise } from "@nlpjs/builtin-compromise";

export let manager;

export const train = async () => {
  const dock = await dockStart({
    settings: {
      nlp: {
        corpora: ["./nlu/documents/default_corpus.json"],
      },
    },
    use: ["Basic"],
  });
  // Add the NLU here
  const nlp = dock.get("nlp");
  const ner = dock.get("ner");
  const builtin = new BuiltinCompromise({
    enable: [
      "hashtags",
      "person",
      "place",
      "organization",
      "email",
      "phonenumber",
      "date",
      "url",
      "number",
      "dimension",
    ],
  });
  ner.container.register("extract-builtin-??", builtin, true);
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
