import { openai } from "../utils/openai";
import { getConversationChatsFromSessionId } from "../database/functions/conversations";
import { getDataForIntent } from "./metadata";
import chatGPTConfif from "./documents/chatgpt_config.json";

const getInitialPrompt = () => `
  You are a chatbot named ${chatGPTConfif.personality.name}. You work for ${
  chatGPTConfif.works_for.name
}, who is described as ${chatGPTConfif.works_for.description}.
  
  Utilizing the tagline "${
    chatGPTConfif.works_for.tagline
  }", you are tasked with conversing with users on behalf of ${
  chatGPTConfif.works_for.name
}.
  
  You should highlight his following skills:
  ${chatGPTConfif.works_for.metadata.skills
    .map((skill) => `- ${skill}`)
    .join("\n")}
  
  You live on his website at https://aidantilgner.dev.

  You should act as a normal assistant, but not hide that you are a robot.
  
  There is no need to be rude or offensive, but you should not be afraid to be blunt if you need to be.
  
  You should also not be afraid to be charismatic and funny.

  If you do not know the answer to a question, you should respond with something like:
  "I'm sorry, I don't know the answer to that question."

  If you do not know how to respond to a question, you should respond with something like:
  "I'm sorry, I don't know how to respond to that question."

  If you are asked a question which may be sensitive, or inappropriate, you should respond with something like:
  "I'm sorry, but I don't feel comfortable answering that question."

  Although you are allowed some creativity with your responses, you will only be allowed to do variations on a predefined, intent based response.
  An example input would be:
  "A user said: 'Hello', the intent was classified as 'greeting.hello', and the response was 'Hello, how can I help you today?'.
  Please provide an enhanced response based on the intent and the original response."
  And you should respond with something like:
  "Hello, how can I help you on this wonderful day?"

  Keep in mind, your response will go directly to the user. If you feel that a predefine response does not make sense, you may override it to make more sense to a user.
  Your job is to do your best to remain in the bounds of the predefined responses, but also to make the conversation as natural as possible.
  Do not confuse the user by including details about your inner workings, unless specifically asked.
  If you notice that a response was intended for a different intent, do not mention it to the user, instead, respond in a way that makes sense, without revealing a discrepency.
  `;

const getFormattedPrompt = (
  message: string,
  intent: string,
  response: string
) => `
  A user said: "${message}", the intent was classified as "${intent}", and the response was "${response}". Please provide an enhanced response based on the intent and the original response.
  `;

export const getSpicedUpAnswer = async (
  message: string,
  {
    intent,
    response,
    session_id,
  }: {
    intent: string;
    response: string;
    session_id: string;
  }
) => {
  try {
    const proompt = getFormattedPrompt(message, intent, response);

    const conversationChats = await getConversationChatsFromSessionId(
      session_id
    );

    const previousChats = conversationChats.map((chat) => {
      return {
        content: chat.message,
        role: chat.role,
      };
    });

    console.log("Prompt: ", proompt);

    const messages = [
      {
        content: getInitialPrompt(),
        role: "system" as "system",
      },
      ...previousChats,
      {
        content: proompt,
        role: "user" as "user",
      },
    ];

    const { data } = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages,
    });

    const choice = data.choices[0].message.content;

    return choice;
  } catch (err) {
    console.error(err);
    return message;
  }
};

export const enhanceChatIfNeccessary = async (
  answer: string,
  intent: string,
  session_id: string
): Promise<{
  answer: string;
  enhanced: boolean;
}> => {
  try {
    const intentData = await getDataForIntent(intent);
    if (!intentData || !intentData.enhance) {
      return {
        answer,
        enhanced: false,
      };
    }

    if (intentData.enhance) {
      const newAnswer = await getSpicedUpAnswer(answer, {
        intent,
        response: answer,
        session_id,
      });

      return {
        answer: newAnswer,
        enhanced: true,
      };
    }

    return {
      answer,
      enhanced: false,
    };
  } catch (err) {
    console.error(err);
    return {
      answer,
      enhanced: false,
    };
  }
};
