const { Command } = require("discord.js-commando");

const config = require("../../config.json");

const ioclient = require("socket.io-client");
const socket = ioclient(`http://localhost:${config.server_port}`);
const getUrls = require("get-urls");

socket.on("connect", function () {
    console.log("resolve.js connected to socket")
});

module.exports = class UpdateCommand extends Command {
    constructor(client) {
        super(client, {
            name: "say",
            group: "wrm",
            memberName: "resolve",
            description: "Resolves the report with the given message ID.",
            examples: ["wrm pls say ty 123456789012345678"],
            args: [
                {
                    key: "type",
                    prompt: "What do you want to do?",
                    type: "string"
                },
                {
                    key: "message",
                    prompt: "What report do you want to resolve?",
                    type: "message"
                }
            ]
        });
    }

    run(msg, { type, message }) {
        switch(type) {
            case "ty":
                socket.emit("resolve", {
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
                break;
            case "no":
                socket.emit("falsify", {
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
                break;
            case "move":
                socket.emit("move", {
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
                break;
            case "investigate":
                socket.emit("investigate", {
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
                break;
            case "remove":
                socket.emit("remove", {
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
                break;
        }
    }
};