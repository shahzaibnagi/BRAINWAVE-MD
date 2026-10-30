const fs = require('fs');
const path = require('path');

const channelInfo = {
    contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363429360598866@newsletter',
            newsletterName: 'BrainWave MD',
            serverMessageId: -1
        }
    }
};

module.exports = {
    name: 'setting',
    aliases: ['settings', 'panel', 'menu'],
    run: async (King, msg, context) => {
        try {
            const chat = msg.chat || msg.key?.remoteJid;
            const sender = msg.sender || msg.key?.participant || chat;

            if (!chat) {
                console.log("⚠️ [Blocked Crash] Cannot send settings: Target JID is undefined.");
                return;
            }

            const botNum = King.user.id.split(':')[0].split('@')[0];
            const configPath = path.join(__dirname, '..', 'database', 'settings.json');
            
            let allSettings = {};
            if (fs.existsSync(configPath)) {
                try {
                    allSettings = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
                } catch (e) {
                    console.log("⚠️ Settings DB parhne mein masla aya, nayi ban rahi hai...");
                }
            }
            
            const botSettings = allSettings[botNum] || {};

            const checkStatus = (val) => val ? '✅ *ON*' : '❌ *OFF*';
            
            const currentPrefix = botSettings.prefix || 'Multi-Prefix ( . / ! # )';

            const menuText = `╭───⚙️ *BRAINWAVE MD PANEL* ⚙️───
│ 👤 *Bot Number:* +${botNum}
│ ⌨️ *Prefix:* ${currentPrefix}
╰─────────────────────────

*🛡️ SECURITY & PRIVACY:*
*1.* Anti Delete      : ${checkStatus(botSettings.antiDelete)}

*🤖 AUTOMATION:*
*3.* Auto Read Msgs   : ${checkStatus(botSettings.autoRead)}
*4.* Auto Status View : ${checkStatus(botSettings.autoStatus)}
*5.* Auto Status React: ${checkStatus(botSettings.autoStatusReact)}
*6.* Group Welcome    : ${checkStatus(botSettings.welcome?.[chat])}
*7.* Auto React       : ${checkStatus(botSettings.autoReact?.[chat])}

>  *B R A I N W A V E  M D*`;

            await King.sendMessage(chat, { 
                text: menuText, 
                mentions: [sender],
                ...channelInfo
            }, { quoted: msg });

        } catch (error) {
            console.error('❌ Settings Command Error:', error);
            const fallbackChat = msg.chat || msg.key?.remoteJid;
            if (fallbackChat) {
                await King.sendMessage(fallbackChat, { text: '❌ Dashboard load karne mein masla aya: ' + error.message });
            }
        }
    }
};
