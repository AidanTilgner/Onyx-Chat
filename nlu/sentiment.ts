import { SentimentAnalyzer } from "node-nlp";

export const analyzer = new SentimentAnalyzer({ language: "en" });

export const getSentimentForText = async (text) => {
  const result = await analyzer.getSentiment(text);
  return result;
};
