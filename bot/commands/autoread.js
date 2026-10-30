const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'autoread',
    aliases: ['autoseen', 'read'],
    run: async (King, m, context) => {
        const { args, reply, isCreator, prefix, command } = context;
        
        if (!isCreator) return reply("⚠️ *Access Denied:* Only the Bot Owner can use this command!");

        if (!args[0] || (args[0].toLowerCase() !== 'on' && args[0].toLowerCase() !== 'off')) {
            return reply(`⚠️ *Syntax Error!*\n\n_Usage:_\n1. *${prefix}${command} on* (Enables Blue Ticks)\n2. *${prefix}${command} off* (Disables Blue Ticks)`);
        }

        const userInput = args[0].toLowerCase();
        const isAutoReadOn = userInput === 'on' ? true : false; 

        const botNumber = King.user.id.split(':')[0].split('@')[0];
        const dbFolder = path.join(__dirname, '..', 'database');
        const settingsFile = path.join(dbFolder, 'settings.json');

        try {
            if (!fs.existsSync(dbFolder)) {
                fs.mkdirSync(dbFolder, { recursive: true });
            }

            let allSettings = {};
            if (fs.existsSync(settingsFile)) {
                allSettings = JSON.parse(fs.readFileSync(settingsFile, 'utf-8'));
            }
            if (!allSettings[botNumber]) allSettings[botNumber] = {};

            allSettings[botNumber].autoRead = isAutoReadOn; 
            
            fs.writeFileSync(settingsFile, JSON.stringify(allSettings, null, 2));

            const statusText = isAutoReadOn ? "ON" : "OFF";
            reply(`✅ *Auto-Read (Blue Ticks)* is now *${statusText}* for this bot!`);
        } catch (e) {
            console.error("Auto-Read Save Error:", e);
            reply(`⚠️ *Database Error:* Could not save settings to settings.json.`);
        }
    }
};
