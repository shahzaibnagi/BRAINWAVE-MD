const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'antidelete',
    aliases: ['ad', 'delete'],
    run: async (King, m, context) => {
        const { args, reply, isCreator, prefix, command } = context;
        if (!isCreator) return reply("⚠️ *Access Denied:* Only the Bot Owner can use this command!");

        if (!args[0] || (args[0].toLowerCase() !== 'on' && args[0].toLowerCase() !== 'off')) {
            return reply(`⚠️ *Syntax Error!*\n\n_Usage:_\n1. *${prefix}${command} on*\n2. *${prefix}${command} off*`);
        }

        const isEnabled = args[0].toLowerCase() === 'on'; 
        const botNumber = King.user.id.split(':')[0].split('@')[0];
        const dbFolder = path.join(__dirname, '..', 'database');
        const settingsFile = path.join(dbFolder, 'settings.json');

        try {
            if (!fs.existsSync(dbFolder)) fs.mkdirSync(dbFolder, { recursive: true });
            let allSettings = fs.existsSync(settingsFile) ? JSON.parse(fs.readFileSync(settingsFile, 'utf-8')) : {};
            if (!allSettings[botNumber]) allSettings[botNumber] = {};

            allSettings[botNumber].antiDelete = isEnabled; 
            fs.writeFileSync(settingsFile, JSON.stringify(allSettings, null, 2));

            reply(`✅ *Anti-Delete* is now *${isEnabled ? 'ON' : 'OFF'}*!`);
        } catch (e) {
            reply(`⚠️ *Database Error.*`);
        }
    }
};
