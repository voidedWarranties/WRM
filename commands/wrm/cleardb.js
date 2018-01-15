const { Command } = require("discord.js-commando");

const config = require("../../config.json");
const mongo = require("mongodb").MongoClient;

module.exports = class ClearDBCommand extends Command {
    constructor(client) {
        super(client, {
            name: "cleardb",
            group: "wrm",
            memberName: "cleardb",
            description: "Clears the entire database collection.",
            examples: ["wrm pls cleardb"]
        });
    }

    run(msg) {
        if(msg.author.id == config.owner_id) {
            mongo.connect(config.mongodb_url, function(err, db) {
                if(err) {
                    throw err;
                }

                console.log("Clearing Database ~!~");
                let reports = db.collection("reports");
                reports.remove({}, function() {
                    console.log("Cleared Database!!");
                });
            });
        }
    }
}