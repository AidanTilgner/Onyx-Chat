export interface NLUResponse {
  locale: string;
  utterance: string;
  languageGuessed: boolean;
  localeIso2: string;
  language: string;
  nluAnswer: {
    classifications: {
      intent: string;
      score: number;
    }[];
  };
  classifications: {
    intent: string;
    score: number;
  }[];
  intent: string;
  score: number;
  domain: string;
  entities: any[];
  sourceEntities: any[];
  answers: any[];
  actions: any[];
  sentiment: {
    score: number;
    numWords: number;
    numHits: number;
    average: number;
    type: string;
    locale: string;
    vote: string;
  };
}
