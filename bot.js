const Discord = require("discord.js");
const Commando = require("discord.js-commando");
const path = require("path");

const config = require("./config.json");
const driver = require("./database/driver.js");
const webServer = require("./web/index.js");

const client = new Commando.Client({
  owner: config.owner_id,
  commandPrefix: config.prefix,
  unknownCommandResponse: false
});

client.on("ready", () => {
  console.log(`Ready- Logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})`);
  client.user.setPresence({
    game: {
      name: "WRM",
      url: "https://twitch.tv/."
    }
  });

  driver.init();
  webServer(client);
});

client.login(config.bot_token);
