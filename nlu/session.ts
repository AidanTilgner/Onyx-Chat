import { v4 as uuidv4 } from "uuid";
import { ConversationContext } from "node-nlp";

export class Session {
  private session_id: string;
  public client: Client;
  private messages: Message[] = [];
  public ConversationContext: ConversationContext = new ConversationContext();

  constructor({ session_id }: { session_id: string }) {
    this.session_id = session_id;
  }

  getSessionId() {
    return this.session_id;
  }

  addClient(client: Client) {
    this.client = client;
  }

  updateClient(client: Partial<Client>) {
    this.client = {
      ...this.client,
      ...client,
    };
  }

  updateUser(user: Partial<User>) {
    this.client.user = {
      ...this.client.user,
      ...user,
    };
  }

  getClient() {
    return this.client;
  }

  addMessage(message: Message) {
    this.messages.push(message);
  }

  getMessages() {
    return this.messages;
  }
}

export interface Client {
  user: User;
}

export interface Message {
  text: string;
  intent: string;
}

export interface User {
  name?: string;
  email?: string;
  [key: string]: any;
}

export const sessions: { [key: string]: Session } = {};

export const createSession = async (id?: string) => {
  const session_id = id || uuidv4();
  sessions[session_id] = new Session({ session_id });
  return session_id;
};

export const getSession = async (session_id: string) => {
  if (sessions.hasOwnProperty(session_id)) {
    return sessions[session_id];
  } else {
    return await createSession(session_id);
  }
};

export const getTestSession = async (): Promise<[Session, () => void]> => {
  const session_id = "test";
  sessions[session_id] = new Session({ session_id });
  return [sessions[session_id], () => delete sessions[session_id]];
};
