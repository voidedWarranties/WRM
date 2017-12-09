const Discord = require("discord.js");
const Commando = require("discord.js-commando");
const path = require("path");

const config = require("./config.json");
const driver = require("./database/driver.js");
const webServer = require("./web/index.js");

const getUrls = require("get-urls");
const ioclient = require("socket.io-client");
const util = require("util");

const socket = ioclient(`http://localhost:${config.server_port}`, {autoConnect: false});

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
  webServer.start(client);
  webServer.io(client, () => {
    console.log("Callback was received from index.js, socket client connecting");
    socket.connect();
  });
});

socket.on("connect", function() {
  console.log("Client > Server");
  if(process.argv[2] && process.argv[2] == "travis") {
    socket.emit("input", {
      author: {
        username: "travis",
        discriminator: "1337",
        id: "1",
        avatar: null
      },
      content: "travis",
      url: "http://voidedxd.xyz",
      attachments: null,
      id: "1"
    });
  }
});

socket.on("travis", function(data) {
  switch(parseInt(data.id, 10)) {
    case 1:
      socket.emit("resolve", data);
      socket.emit("input", {
        author: {
          username: "travis",
          discriminator: "1337",
          id: "1",
          avatar: null
        },
        content: "travis",
        url: "http://voidedxd.xyz",
        attachments: null,
        id: "2"
      });
      break;
    case 2:
      socket.emit("falsify", data);
      socket.emit("input", {
        author: {
          username: "travis",
          discriminator: "1337",
          id: "1",
          avatar: null
        },
        content: "travis",
        url: "http://voidedxd.xyz",
        attachments: null,
        id: "3"
      });
      break;
    case 3:
      socket.emit("move", data);
      socket.emit("input", {
        author: {
          username: "travis",
          discriminator: "1337",
          id: "1",
          avatar: null
        },
        content: "travis",
        url: "http://voidedxd.xyz",
        attachments: null,
        id: "4"
      });
      break;
    case 4:
      socket.emit("investigate", data);
      socket.emit("input", {
        author: {
          username: "travis",
          discriminator: "1337",
          id: "1",
          avatar: null
        },
        content: "travis",
        url: "http://voidedxd.xyz",
        attachments: null,
        id: "5"
      });
      break;
    case 5:
      socket.emit("remove", data);
  }
});

socket.on("error", function(error) {
  console.log("SocketIO Client Error");
  console.log(error);
});

client.on("message", message => {
  if(message.channel.guild.id === config.server_id && message.channel.name === "support") {
    if(message.attachments.array().length || Array.from(getUrls(message.content)).length) {
      socket.emit("input", {
        author: {
          username: message.author.username,
          discriminator: message.author.discriminator,
          id: message.author.id,
          avatar: message.author.avatarURL ? message.author.avatarURL : message.author.defaultAvatarURL
        },
        content: message.content,
        url: Array.from(getUrls(message.content)).length ? Array.from(getUrls(message.content)) : null,
        attachments: message.attachments.array().length ? message.attachments.array().map(a => a.url) : null,
        id: message.id
      });
    }
  }
});

client.login(config.bot_token);
