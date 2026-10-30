const fs = require('fs');
const path = require('path');

const channelInfo = {
    contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363429360598866@newsletter',
            newsletterName: 'BrainWave md',
            serverMessageId: -1
        }
    }
};

module.exports = {
    name: 'autoreact',
    aliases: ['react', 'chatbotreact', 'botreact'],
    run: async (King, m, context) => {
        try {
            const { args, isCreator, reply } = context;
            const chat = m.chat || m.key?.remoteJid;

            if (!chat.endsWith('@g.us')) return reply('❌ This protocol is restricted to Groups only!');

            if (!isCreator) {
                return reply('⚠️ *ACCESS DENIED*\n\n_Only the System Administrator (Owner) can configure Auto-React._');
            }

            const botNumber = King.user.id.split(':')[0].split('@')[0];
            const configPath = path.join(__dirname, '..', 'database', 'settings.json');
            
            let allSettings = {};
            if (fs.existsSync(configPath)) allSettings = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
            if (!allSettings[botNumber]) allSettings[botNumber] = {};
            if (typeof allSettings[botNumber].autoReact !== 'object') allSettings[botNumber].autoReact = {};

            const commandArg = args[0]?.toLowerCase();

            if (commandArg === 'on') {
                allSettings[botNumber].autoReact[chat] = true;
                fs.writeFileSync(configPath, JSON.stringify(allSettings, null, 2));
                
                if (global.settingsCache && global.settingsCache[botNumber]) {
                    if (typeof global.settingsCache[botNumber].autoReact !== 'object') global.settingsCache[botNumber].autoReact = {};
                    global.settingsCache[botNumber].autoReact[chat] = true;
                }

                await King.sendMessage(chat, { text: '✅ *Auto React Enabled!*\n\nThe bot will now react to messages in the background.', ...channelInfo }, { quoted: m });
                
            } else if (commandArg === 'off') {
                allSettings[botNumber].autoReact[chat] = false;
                fs.writeFileSync(configPath, JSON.stringify(allSettings, null, 2));
                
                if (global.settingsCache && global.settingsCache[botNumber]) {
                    if (typeof global.settingsCache[botNumber].autoReact !== 'object') global.settingsCache[botNumber].autoReact = {};
                    global.settingsCache[botNumber].autoReact[chat] = false;
                }

                await King.sendMessage(chat, { text: '❌ *Auto React Disabled*\n\nBackground reactions stopped for this node.', ...channelInfo }, { quoted: m });
                
            } else {
                const isOn = allSettings[botNumber].autoReact[chat] === true;
                const statusCard = `╭╼━≪• 𝗔𝗨𝗧𝗢-𝗥𝗘𝗔𝗖𝗧 𝗖𝗢𝗡𝗧𝗥𝗢𝗟 •≫━╾╮\n┃\n┃ ⚙️ *Target:* This Group\n┃ 📊 *Status:* ${isOn ? 'Enabled ✅' : 'Disabled ❌'}\n┃\n┃ *Usage:*\n┃ ⚡ .autoreact on\n┃ ⚡ .autoreact off\n┃\n╰━━━━━━━━━━━━━━━╯\n\n> 🧠 *BrainWave md*`;
                await King.sendMessage(chat, { text: statusCard, ...channelInfo }, { quoted: m });
            }
        } catch (error) {
            console.error('AutoReact Controller Error:', error);
            if (context.reply) context.reply('❌ Controller Error: ' + error.message);
        }
    }
};
