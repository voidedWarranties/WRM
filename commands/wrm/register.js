const Discord = require("discord.js");
const { Command } = require("discord.js-commando");
const config = require("../../config.json");
const randomstring = require("randomstring");

module.exports = class RegisterCommand extends Command {
    constructor(client) {
        super(client, {
            name: "register",
            group: "wrm",
            memberName: "register",
            description: "Registers user for WRM use.",
            examples: ["wrm pls register asdf"],
            args: [
                {
                    key: "regid",
                    prompt: "Please enter the string required to register.",
                    type: "string"
                }
            ]
        });
    }

    run(msg, { regid }) {
        if(msg.member.hasPermission(Discord.Permissions.FLAGS.MANAGE_MESSAGES)) {
            if(regid === "init") {
                this.client.user.setPresence({
                    game: {
                        name: randomstring.generate(16),
                        url: "https://twitch.tv/."
                    }
                });
            }

            if(regid === this.client.user.presence.game.name) {
                msg.member.addRole(this.client.guilds.find("id", config.server_id).roles.find("name", config.wrm_rolename));
                this.client.user.setPresence({
                    game: {
                        name: randomstring.generate(16),
                        url: "https://twitch.tv/."
                    }
                });
            }
        }
        msg.delete();
    }
}