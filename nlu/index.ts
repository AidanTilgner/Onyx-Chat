import { NlpManager } from "node-nlp";
import text_to_intent from "./documents/text_to_intent.json";
import entities from "./documents/entities.json";
import config from "./documents/config.json";
import intent_to_response from "./documents/intent_to_response.json";
import type { NLUResponse } from "./index.d";
import { extractResponseFromIntent } from "./parsing";
const modelName = `nlu/models/${Date.now()}.model.json`;
import { getSession } from "./session";

export const nlp_manager = new NlpManager({
  languages: ["en"],
  modelFileName: modelName,
});

const trainTextToIntent = async () => {
  try {
    const intents: string[] = [];
    const promises = text_to_intent.map(async (example) => {
      const { lang = config.default_language, text, intent } = example;
      const [allowed, words] = checkDisallowedIntentKeywords(intent);
      if (!allowed) {
        throw new Error(
          `Intent ${intent} contains disallowed keywords: ${words.join(", ")}`
        );
      }
      if (!intents.includes(intent)) {
        intents.push(intent);
      }
      return await nlp_manager.addDocument(lang, text, intent);
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
          return await nlp_manager.addNamedEntityText(
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
  await nlp_manager.train();
  // nlp_manager.save(modelName);
};

export const getFullNLUResponse = async (
  text: string,
  session_id?: string,
  lang?: string
): Promise<NLUResponse> => {
  const convoContext = (await getSession(session_id)).ConversationContext;
  const response = (await nlp_manager.process(
    lang || config.default_language,
    text,
    convoContext
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
      session_id,
      lang || config.default_language
    );
    const response = await extractResponseFromIntent(intent, session_id);
    return response;
  } catch (err) {
    console.error("There was an error during NLU", err);
    return null;
  }
};

// * Words that should not appear in intents
const disallowedIntentKeywords = [
  "nlu",
  "nlp",
  "intent",
  "entity",
  "entities",
  "train",
  "training",
  "trainings",
  "response",
  "responses",
  "variable",
  "variables",
  "context",
  "contexts",
  "session",
  "sessions",
];

const checkDisallowedIntentKeywords = (intent: string): [boolean, string[]] => {
  const intentWords = intent.split(".");
  const disallowedWords = intentWords.filter((word) =>
    disallowedIntentKeywords.includes(word)
  );
  return [disallowedWords.length === 0, disallowedWords];
};
