# Onyx Chat
Onyx Chat is a framework for creating a simple chatbot. The idea behind this being a standalone module is that it is a 
chatbot, which instead of communicating with me on the world's behalf, communicates with the world on my behalf. I didn't 
want to risk the runaway complexity and security concerns of having the Onyx Interpretation engine juggle the two. 
Thus, Onyx Chat was born. A cleaner, customizable, and REST API based chatbot, which uses [nlp.js](https://github.com/axa-group/nlp.js) 
to interpret end-user plain english, and send the proper response back.

## Integration
Integration with Onyx Chat is very simple. Once you have your Onyx Chat instance configured, simply interface with it like any REST api.

## Triggers
This feature doesn't exist quite yet, but the idea is that you don't want user speech directly triggering any actions on the Onyx Core
modules themselves. This is due to the same privacy and complexity concerns highlighted above. However, there will likely be times when
end-user speech should result in actions being performed. Therefore, triggers will act as a bridge/interface between the Chatbot
intent classification, and the procedures module in Onyx Core. If you want a certain intent to trigger an action, you will
define that in the corpus, and it will be dispatched once a response has been sent, potentially triggering an action.