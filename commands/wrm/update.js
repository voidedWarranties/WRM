const { Command } = require("discord.js-commando");

const config = require("../../config.json");

const ioclient = require("socket.io-client");
const socket = ioclient(`http://localhost:${config.server_port}`);
const getUrls = require("get-urls");

const wrm = require("../../utils/wrm");

socket.on("connect", function () {
    console.log("update.js connected to socket")
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
                },
                {
                    key: "text",
                    prompt: "What is the custom message you want?",
                    type: "string",
                    default: ""
                }
            ]
        });
    }

    run(msg, { type, message, text }) {
        if(config.trusted_user_ids.indexOf(msg.author.id) > -1 || msg.author.id === config.owner_id) {
            switch(type) {
                case "ty":
                    wrm.removeWithMessage(socket, message, `Solved, Thanks for reporting <@${message.author.id}>`);
                    break;
                case "no":
                    wrm.removeWithMessage(socket, message, `Invalid report, Not punishable, Thanks for reporting <@${message.author.id}>`);
                    break;
                case "move":
                    wrm.removeWithMessage(socket, message, "Please move to #general for chatting.");
                    break;
                case "investigate":
                    wrm.noRemove(socket, message, `<@${message.author.id}>, Your report is undergoing investigation, please be patient!`);
                    break;
                case "remove":
                    wrm.remove(socket, message);
                    break;
                case "custom":
                    if(text) {
                        wrm.removeWithMessage(socket, message, text);
                    }
                    break;
            }
            msg.delete();
        } else {
            msg.delete();
        }
    }
};