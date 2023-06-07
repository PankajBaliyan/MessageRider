const TelegramBot = require('node-telegram-bot-api');

// Configure DonEnv
require('dotenv').config();

// Telegram bot token
const token = process.env.TOKEN;
const Admin_User_ID = process.env.ADMIN_USER_ID

// Create a new instance of the TelegramBot
const bot = new TelegramBot(token, { polling: true });

// Testing Bot
bot.on('message', (msg)=> {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Hello Worldd');
})

// Store active users
let activeUsers = {};

// Function to send a message to all active users
const broadcastMessage = (message) => {
    Object.keys(activeUsers).forEach((userId) => {
        bot.sendMessage(userId, message);
    });
};

// Function to send a media file to all active users
const broadcastMedia = (media) => {
    Object.keys(activeUsers).forEach((userId) => {
        bot.sendPhoto(userId, media);
    });
};

// Handle incoming messages
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const userName = msg.from.first_name;

    // Check if the message is from the admin (you)
    if (userId === Admin_User_ID) {
        // Count the number of active users
        const activeUserCount = Object.keys(activeUsers).length;

        // Send the message to all active users
        broadcastMessage(msg.text);

        // Send a response to the admin
        bot.sendMessage(chatId, `Message sent to ${activeUserCount} users.`);
    } else {
        // Update active users list
        activeUsers[userId] = userName;

        // Send a response to the user
        bot.sendMessage(chatId, 'Thank you for subscribing!');
    }
});

// Handle media files
bot.on('photo', (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const userName = msg.from.first_name;

    // Check if the message is from the admin (you)
    if (userId === Admin_User_ID) {
        // Count the number of active users
        const activeUserCount = Object.keys(activeUsers).length;

        // Send the media file to all active users
        broadcastMedia(msg.photo[0].file_id);

        // Send a response to the admin
        bot.sendMessage(chatId, `Media file sent to ${activeUserCount} users.`);
    } else {
        // Update active users list
        activeUsers[userId] = userName;

        // Send a response to the user
        bot.sendMessage(chatId, 'Thank you for subscribing!');
    }
});

// Handle user status
bot.onText(/\/status/, (msg) => {
    const chatId = msg.chat.id;
    const activeUserCount = Object.keys(activeUsers).length;
    const activeUserList = Object.values(activeUsers).join('\n');

    bot.sendMessage(
        chatId,
        `Active User Count: ${activeUserCount}\n\nActive Users:\n${activeUserList}`
    );
});

// Handle broadcast command
bot.onText(/\/broadcast (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const broadcastMessage = match[1];

    // Count the number of active users
    const activeUserCount = Object.keys(activeUsers).length;

    // Send the broadcast message to all active users
    broadcastMessage(broadcastMessage);

    // Send a response to the admin
    bot.sendMessage(
        chatId,
        `Broadcast message sent to ${activeUserCount} users.`
    );
});
