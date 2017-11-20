const Discord = require("discord.js");
const Commando = require("discord.js-commando");
const path = require("path");

const config = require("./config.json");
const driver = require("./database/driver.js");
const webServer = require("./web/index.js");

const getUrls = require("get-urls");
const ioclient = require("socket.io-client");
const util = require("util");

const socket = ioclient(`http://${config.socket_url}:4000`, {autoConnect: false});

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
  socket.connect();
});

socket.on("connect", function() {
  console.log("Client > Server");
});

socket.on("error", function(error) {
  console.log("SocketIO Client Error");
  console.log(error);
});

client.on("message", message => {
  if(message.channel.guild.id === config.server_id && message.channel.name === "support") {
    console.log(message.attachments.array().length);
    console.log(Array.from(getUrls(message.content)).length);
    if(message.attachments.array().length || Array.from(getUrls(message.content)).length) {
      console.log(message.attachments, Array.from(getUrls(message.content)));
      socket.emit("input", {
        author: {
          username: message.author.username,
          discriminator: message.author.discriminator,
          avatar: message.author.avatarURL ? message.author.avatarURL : meessage.author.defaultAvatarURL
        },
        content: message.content,
        url: Array.from(getUrls(message.content)).length ? Array.from(getUrls(message.content)) : null,
        attachments: message.attachments.array().length ? message.attachments.array().map(a => a.url) : null
      });
    }
  }
});

client.login(config.bot_token);
