const Discord = require("discord.js");
const { Command } = require("discord.js-commando");

const config = require("../../config.json");

const ioclient = require("socket.io-client");
const socket = ioclient(`http://localhost:${config.server_port}`);
const getUrls = require("get-urls");

const checkUtil = require("../../utils/check");

socket.on("connect", function() {
    console.log("check.js connected to socket");
});

module.exports = class CheckCommand extends Command {
    constructor(client) {
        super(client, {
            name: "check",
            group: "wrm",
            memberName: "check",
            description: "Checks the status of the report given.",
            examples: ["wrm pls check 123456789012345678"],
            args: [
                {
                    key: "message",
                    prompt: "Please enter an ID to check.",
                    type: "message"
                }
            ]
        });
    }

    run(msg, { message }) {
        checkUtil.find(message.id).then((document) => {
            if(document) {
                const checkE = new Discord.RichEmbed();
                checkE.setAuthor(`${document.author.username}#${document.author.discriminator}`, document.author.avatar);
                checkE.setTitle(`Status for Report ID ${message.id}`);
                checkE.setDescription(`Status: ${document.status}`);
                msg.channel.send(checkE);
            }
        });
    }
}