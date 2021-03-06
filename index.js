const { Bot } = require("./bot")
const Command  = require("./bot/command")
const Handler = require("./bot/handler")

const { createServer } = require("bottender/express")

// Setup Bot
Bot.setInitialState({
  searchRadius: 10
})

Bot.onEvent(async context => {
  if (Command.parse(context.event.text, context)) { return }
  Handler.handle(context)
})

const arg = JSON.parse(process.env.npm_config_argv)
if(arg.original.length > 1 && arg.original[0] == "run" &&  arg.original[1] == "dev") {
  Bot.createRuntime()
}

// Setup Server
var areIntlLocalesSupported = require("intl-locales-supported");
var localesMyAppSupports = ["de-DE"];

if (global.Intl) {
  if (!areIntlLocalesSupported(localesMyAppSupports)) {
    require("intl");
    Intl.NumberFormat = IntlPolyfill.NumberFormat;
    Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat;
  }
} else {
  global.Intl = require("intl");
}

const server = createServer(Bot);
server.listen(process.env.PORT, () => {
  console.log("server is running on " + process.env.PORT + " port...");
});

