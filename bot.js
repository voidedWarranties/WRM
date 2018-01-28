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
  console.log(`Invite me with: https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=2146958591`);
  client.user.setPresence({
    game: {
      name: `${config.version}`,
      url: "https://twitch.tv/."
    }
  });

  driver.init();
  webServer.start(client);
  webServer.io(client, () => {
    console.log("Callback was received from index.js, socket client connecting");
    socket.connect();
    client.registry
    .registerDefaultTypes()
    .registerGroups([
      ["wrm", "Wonderland Report Manager"]
    ])
    .registerCommandsIn(path.join(__dirname, "commands"));
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
      socket.emit("custom", {
        message: data,
        type: "resolve"
      });
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
      socket.emit("custom", {
        message: data,
        type: "falsify"
      });
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
      socket.emit("custom", {
        message: data,
        type: "move"
      });
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
      socket.emit("nodelcustom", {
        message: data,
        type: "investigate"
      });
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
      socket.emit("custom", {
        message: data,
        type: "remove"
      });
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
        id: message.id,
        status: "Submitted"
      });
    }
  }
});

client.login(config.bot_token);
