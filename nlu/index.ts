import { NlpManager } from "node-nlp";
import text_to_intent from "./documents/text_to_intent.json";
import entities from "./documents/entities.json";
import config from "./documents/config.json";
import intent_to_response from "./documents/intent_to_response.json";
import type { NLUResponse } from "./index.d";
import { extractResponseFromIntent } from "./parsing";

// model name is current randomstring__currenttimestamp.json
const randomstring = Math.random().toString(36).substring(7);
const modelName = `nlu/models/${Date.now()}.model.json`;

export const manager = new NlpManager({
  languages: ["en"],
  modelFileName: modelName,
});

const trainTextToIntent = async () => {
  try {
    const intents: string[] = [];
    const promises = text_to_intent.map(async (example) => {
      const { lang = config.default_language, text, intent } = example;
      if (!intents.includes(intent)) {
        intents.push(intent);
      }
      return await manager.addDocument(lang, text, intent);
    });
    await Promise.all(promises);
  } catch (err) {
    console.error("There was an error during training", err);
  }
};

const trainEntities = async () => {
  try {
    const promises = Object.entries(entities).map(
      async ([entity, { options }]) => {
        const p = options.map(async (option) => {
          const {
            langs = [config["default_language"]],
            name,
            examples,
          } = option;
          return await manager.addNamedEntityText(
            entity,
            name,
            langs,
            examples
          );
        });
        return await Promise.all(p);
      }
    );
    await Promise.all(promises);
  } catch (err) {
    console.error("There was an error during training", err);
  }
};

export const train = async () => {
  await trainTextToIntent();
  await trainEntities();
  await manager.train();
  // manager.save(modelName);
};

export const getFullNLUResponse = async (
  text: string,
  lang?: string
): Promise<NLUResponse> => {
  const response = (await manager.process(
    lang || config.default_language,
    text
  )) as NLUResponse;
  return response;
};

export const getNLUResponse = async (
  text: string,
  session_id: string,
  lang?: string
) => {
  try {
    const { intent } = await getFullNLUResponse(
      text,
      lang || config.default_language
    );
    const response = await extractResponseFromIntent(intent, session_id);
    return response;
  } catch (err) {
    console.error("There was an error during NLU", err);
    return null;
  }
};
