const getUrls = require("get-urls");

module.exports = {
    noRemove: (socket, message, text, status) => {
        socket.emit("nodelcustom", {
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
            text: text,
            status: status
        });
    },
    remove: (socket, message, status) => {
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
            status: status
        });
    },
    removeWithMessage: (socket, message, text, status) => {
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
            text: text,
            status: status
        });
    }
}