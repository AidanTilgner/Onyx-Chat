import context_json from "./documents/context.json";
import { v4 as uuidv4 } from "uuid";
import { ConversationContext } from "node-nlp";

export interface Context {
  me?: User;
}

export interface User {
  first_name?: string;
  last_name?: string;
  email?: string;
}

const contexts: { [key: string]: Context } = {};

export const defaultContext: Context = context_json;

export const createContext = async (name: string, context: Context) => {
  contexts[name] = context;
  return name;
};

export const getContext = async (name: string) => {
  return contexts[name];
};

export const getAllContexts = async () => {
  return contexts;
};
