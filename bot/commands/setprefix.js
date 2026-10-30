const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'setprefix',
    aliases: ['prefix', 'changeprefix'],
    run: async (King, m, context) => {
        const { args, reply, isCreator } = context;
        
        if (!isCreator) return reply("⚠️ *Access Denied:* Only the Owner can use this command!");

        if (!args[0]) return reply("⚠️ *Syntax Error:* Provide a new prefix!\n_Example:_ `.setprefix !`");

        const newPrefix = args[0];
        const botNumber = King.user.id.split(':')[0].split('@')[0];
        const dbFolder = path.join(__dirname, '..', 'database');
        const settingsFile = path.join(dbFolder, 'settings.json');

        let allSettings = JSON.parse(fs.readFileSync(settingsFile, 'utf-8'));
        if (!allSettings[botNumber]) allSettings[botNumber] = {};
        
        allSettings[botNumber].prefix = newPrefix;
        fs.writeFileSync(settingsFile, JSON.stringify(allSettings, null, 2));

        reply(`✅ *Prefix Updated!*\nThe new prefix is now [ *${newPrefix}* ]. Test it out with the new prefix!`);
    }
};
