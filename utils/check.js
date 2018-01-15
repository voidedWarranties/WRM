const mongo = require("mongodb").MongoClient;
const config = require("../config");

var find = () => {};

mongo.connect(config.mongodb_url, function(err, db) {
    if(err) {
        throw err;
    }

    console.log("check.js connected to DB");
    let reports = db.collection("reports");

    find = (id) => {
        return reports.findOne({id: id}, {}).then(document => {
            return document.status;
        });
    };

    exports.find = find;
});