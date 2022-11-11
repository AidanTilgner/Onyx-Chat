import { v4 as uuidv4 } from "uuid";

export class Session {
  private session_id: string;
  public client: Client;
  private messages: Message[] = [];

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

export const createSession = async () => {
  const session_id = uuidv4();
  sessions[session_id] = new Session({ session_id });
  return session_id;
};

export const getSession = async (session_id: string) => {
  return sessions[session_id];
};

export const getTestSession = async (): Promise<[Session, () => void]> => {
  const session_id = "test";
  sessions[session_id] = new Session({ session_id });
  return [sessions[session_id], () => delete sessions[session_id]];
};
