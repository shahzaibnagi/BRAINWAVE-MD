const fs = require('fs');

module.exports = {
    name: 'setprefix',
    aliases: ['prefix'],
    run: async (King, m, { args, isCreator, reply, botNumber, allSettings, settingsFile, prefix }) => {
        if (!isCreator) return reply("⚠️ Access Denied. Only the Bot Owner can change the prefix!");
        if (!args[0]) return reply(`⚠️ *Syntax Error!*\n_Usage:_ *${prefix}setprefix !*`);
        
        allSettings[botNumber].prefix = args[0];
        fs.writeFileSync(settingsFile, JSON.stringify(allSettings, null, 2));
        
        reply(`✅ Success! The bot prefix is now set to: *${args[0]}*`);
    }
};
