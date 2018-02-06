const { Command } = require("discord.js-commando");
const TimeFormat = require("hh-mm-ss");

module.exports = class PingCommand extends Command {
    constructor(client) {
        super(client, {
            name: "ping",
            group: "wrm",
            memberName: "ping",
            description: "Pong",
            examples: ["wrm pls ping"]
        });
    }

    async run(msg) {
        const m = await msg.channel.send("Ping?");
        //console.log(this.client.emojis.find("name", "fidget_spinner"));
        m.edit(`Pong! Latency is ${m.createdTimestamp - msg.createdTimestamp}ms. API Latency is ${Math.round(this.client.ping)}ms. Uptime ${TimeFormat.fromMs(this.client.uptime, "hh:mm:ss.sss")}.`);
        msg.delete();
    }
}