const { Command } = require("discord.js-commando");
const config = require("../../config.json");

module.exports = class TestCommand extends Command {
    constructor(client) {
        super(client, {
            name: "test",
            group: "wrm",
            memberName: "test",
            description: "Do you have the WRM role?",
            examples: ["wrm pls ping"]
        });
    }

    async run(msg) {
        if(this.client.guilds.find("id", config.server_id).members.find("id", msg.author.id).roles.find("name", config.wrm_rolename)) {
            msg.channel.send("You have the WRM Role");
        } else {
            msg.channel.send("You do not have the WRM Role");
        }
    }
}