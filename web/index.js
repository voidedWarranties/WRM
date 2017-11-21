const express = require("express");
const session = require("express-session");
const ejs = require("ejs");

const path = require("path");

const mongoose = require("mongoose");
const mongooseSession = require("connect-mongo")(session);

const mongo = require("mongodb").MongoClient; // TWO DRIVERS???? TWO DRIIIVERRSSSS

const driver = require("./../database/driver.js");

const passport = require("passport");
const DiscordStrategy = require("passport-discord").Strategy;

const config = require("./../config.json");

const app = express();

const store = new mongooseSession({
  mongooseConnection: driver.getConnection()
});

app.engine("ejs", ejs.renderFile);
app.set("views", `${__dirname}/views`);
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

const scopes = ["identify", "email", "guilds"];

module.exports = {
  start: (bot) => {
    driver.getConnection().on("connected", function() {
      console.log("Mongoose Connected");
    });

    function checkAuthenticated(req, res, next) {
      if(req.isAuthenticated()) { return next; }
      res.redirect("/");
      return true;
    }

    function getAuthUser(user) {
      return {
        username: user.username,
        discriminator: user.discriminator,
        id: user.id,
        avatar: user.avatar ? (`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.jpg`) : "https://discordapp.com/assets/6debd47ed13483642cf09e832ed0bc1b.png",
        guilds: user.guilds
      };
    }

    function getGuildInfo(guild) {
      return {
        name: guild.name,
        id: guild.id,
        icon: guild.icon ? (`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.jpg`) : "https://discordapp.com/assets/6debd47ed13483642cf09e832ed0bc1b.png"
      };
    }

    function botInGuild(guild) {
      return bot.guilds.get(guild.id) != null;
    }

    passport.use(new DiscordStrategy({
      clientID: config.client_id,
      clientSecret: config.client_secret,
      callbackURL: `${config.hosting_url}login/callback`,
      scope: scopes
    }, (accessToken, refreshToken, profile, done) => {
      process.nextTick(() => {
        return done(null, profile);
      });
    }));

    passport.serializeUser((user, done) => {
      done(null, user);
    });

    passport.deserializeUser((id, done) => {
      done(null, id);
    });

    app.use(session({
      secret: "cIGxEWj4PwbnasdurJzS",
      resave: false,
      saveUninitialized: false,
      store
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    app.use((error, req, res, next) => {
      res.status(500).send(error);
      console.error(error);
    });

    app.get("/", (req, res) => {
      const uptime = process.uptime();
      res.render("landing.ejs", {
        authUser: req.isAuthenticated() ? getAuthUser(req.user) : null,
        bot,
        getGuildInfo,
        botInGuild,
        inviteLink: `https://discordapp.com/oauth2/authorize?client_id=${bot.user.id}&scope=bot&permissions=2146958591`,
        config
      });
    });

    app.get("/login", passport.authenticate("discord", {
      scope: scopes
    }));

    app.get("/login/callback", passport.authenticate("discord", {
      failureRedirect: "/"
    }), (req, res) => {
      if(config.trusted_user_ids.indexOf(req.user.id) > -1 || req.user.id === config.owner_id) {
        res.redirect("/");
      } else {
        res.redirect("/error");
      }
    });

    app.get("/logout", (req, res) => {
      req.logout();
      res.redirect("/");
    });

    app.get("/error", (req, res) => {
      res.render("error.ejs");
    });

    app.get("/reports", (req, res) => {
      // res.send(bot.guilds.find("id", config.server_id).channels.find("name", "support"));
      res.render("reports.ejs", {
        socket_url: config.socket_url
      });
    });

    app.listen(config.server_port, config.server_ip, () => {
      console.log("WebPanel Running");
    });
  },
  io: (bot, callback) => {
    const io = require("socket.io").listen(4000).sockets;
    mongo.connect(config.mongodb_url, function(err, db) {
      if(err) {
        throw err;
      }

      console.log("MongoDB Native Driver Connected, telling client, bot.js, it is okay to connect now");
      callback();
      io.on("connect", function(socket) {
        console.log("index.js Socket Connected");
        let reports = db.collection("reports");

        const update = () => {
          reports.find().toArray(function(err, res) { // Weird way of updating list
            if(err) {
              throw err;
            }

            socket.emit("output", res);
          });
        }

        update();

        socket.on("input", function(data) {
          console.log("INPUT");

          reports.insert(data, function() {
            io.emit("output", [data]);
          });
        });

        socket.on("clear", function(data) {
          reports.remove({}, function() {
            socket.emit("cleared");
            console.log("CLEARED REPORTS");
          });
        });

        socket.on("resolve", function(data) {
          reports.remove({id: data.id}, function() {
            bot.guilds.find("id", config.server_id).channels.find("name", "support").send(`Solved, Thanks for reporting <@${data.author.id}>`);
            reports.find().toArray(function(err, res) { // Weird way of updating list
              if(err) {
                throw err;
              }

              socket.emit("delete", res);
            });
          });
        });
      });
    });
  }
}
