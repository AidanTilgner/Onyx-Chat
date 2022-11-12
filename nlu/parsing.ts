import intent_to_response from "./documents/intent_to_response.json";
import { getSession } from "./session";
import { defaultContext, getContext } from "./context";

export const parseResponsesFromIntent = async (
  int: string
): Promise<
  {
    text: string;
    variables?: {
      [key: string]: string;
    };
  }[]
> => {
  const intent: string[] = int.split(".");

  const { responses } = intent.reduce((acc, curr) => {
    return acc[curr];
  }, intent_to_response);\

  return responses;
};

export const extractResponseFromIntent = async (
  int: string,
  session_id?: string
) => {
  const responses = await parseResponsesFromIntent(int);
  const randomIndex = getRandomIndex(responses);
  const selectedResponse = responses[randomIndex];
  const { text, variables } = selectedResponse;
  const values = await getVariablesFromResponse(variables, session_id);
  const newText = await replaceVariablesInText(text, values);

  return newText;
};

export const getRandomIndex = (arr: any[]) => {
  const index = Math.floor(Math.random() * arr.length);
  return index;
};

export const getVariablesFromResponse = async (
  vars: { [key: string]: string },
  session_id?: string
) => {
  if (!vars) {
    return {};
  }
  const variables: { [key: string]: any } = {};
  for (const [key, value] of Object.entries(vars)) {
    const vl = await getVariableValue(value, session_id);
    variables[key] = vl;
  }
  return variables;
};

export const getVariableValue = async (
  varName: string,
  session_id?: string
) => {
  const session = await getSession(session_id);
  const context = defaultContext;

  const [type, ...path] = varName.split(".");

  let value: any;

  switch (type) {
    case "session":
      value = path.reduce((acc, curr) => {
        if (acc) {
          return acc[curr];
        }
      }, session);
      break;
    case "context":
      value = path.reduce((acc, curr) => {
        // make sure it's not undefined
        if (acc) {
          return acc[curr];
        }
      }, context);
      break;
    default:
      const ctx = getContext(type);
      const ctxVal = path.reduce((acc, curr) => {
        if (acc) {
          return acc[curr];
        }
      }, ctx);
      value = ctxVal || null;
      break;
  }

  return value;
};

export const replaceVariablesInText = async (
  text: string,
  variables: { [key: string]: any }
) => {
  // variables in text will be in the following formats:
  // {{variable_name}}
  // {{variable_name|default_value}}
  // {{variable_name|default_value}}
  // {{function_name|arg1|arg2|arg3}} -> TODO: this one is not implemented yet

  // also account for spaces around the variable name
  const regex = /{{\s*([a-zA-Z0-9_]+)\s*(?:\|\s*([a-zA-Z0-9_]+)\s*)?}}/g;
  const matches = text.match(regex);
  let newText = "";
  if (matches) {
    for (const match of matches) {
      const [variable, defaultValue] = match
        .replace("{{", "")
        .replace("}}", "")
        .split("|");
      const value = variables[variable.trim()] || defaultValue || "";
      newText = text.replace(match, value);
    }
  }

  return newText;
};
