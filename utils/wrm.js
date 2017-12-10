const getUrls = require("get-urls");

module.exports = {
    investigate: (socket, message) => {
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
    },
    remove: (socket, message) => {
        socket.emit("custom", { 
            message: {
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
            }
        });
    },
    removeWithMessage: (socket, message, text) => {
        socket.emit("custom", {
            message: {
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
            },
            text: text
        });
    }
}