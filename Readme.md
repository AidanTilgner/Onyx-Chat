# Onyx Chat

Onyx Chat is a framework for creating a simple chatbot. The idea behind this being a standalone module is that it is a
chatbot, which instead of communicating with me on the world's behalf, communicates with the world on my behalf. I didn't
want to risk the runaway complexity and security concerns of having the Onyx Interpretation engine juggle the two.
Thus, Onyx Chat was born. A cleaner, customizable, and REST API based chatbot, which uses [nlp.js](https://github.com/axa-group/nlp.js)
to interpret end-user plain english, and send the proper response back.

## Integration

Integration with Onyx Chat is very simple. Once you have your Onyx Chat instance configured, simply interface with it like any REST api.

## Onyx Core Integration

Onyx Chat allows easy integration with Onyx Core. This is through things like triggers, which allow you to dispatch actions, based on user interaction, with no security or privacy risk. The only thing you have to do is define them in your configuration. See the documentation on triggers for more information (documentation > Triggers).
