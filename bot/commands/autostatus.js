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
    name: 'autostatus',
    aliases: ['statusview', 'as'],
    run: async (King, msg, context) => {
        try {
            const { args, isCreator } = context; 
            
            const chat = msg.chat || msg.key?.remoteJid;
            if (!chat) return console.log("⚠️ Error: Chat ID not found.");

            if (!msg.key.fromMe && !isCreator) {
                await King.sendMessage(chat, { 
                    text: '❌ This command can only be used by the owner!',
                    ...channelInfo
                }, { quoted: msg });
                return;
            }

            const botNumber = King.user.id.split(':')[0].split('@')[0];
            const configPath = path.join(__dirname, '..', 'database', 'settings.json');
            
            let allSettings = {};
            if (fs.existsSync(configPath)) {
                allSettings = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
            }
            if (!allSettings[botNumber]) allSettings[botNumber] = { autoStatus: false, autoStatusReact: false };

            const config = allSettings[botNumber];

            if (!args || args.length === 0) {
                const status = config.autoStatus ? 'enabled' : 'disabled';
                const reactStatus = config.autoStatusReact ? 'enabled' : 'disabled';
                await King.sendMessage(chat, { 
                    text: `🔄 *Auto Status Settings*\n\n📱 *Auto Status View:* ${status}\n💫 *Status Reactions:* ${reactStatus}\n\n*Commands:*\n.autostatus on - Enable auto status view\n.autostatus off - Disable auto status view\n.autostatus react on - Enable status reactions\n.autostatus react off - Disable status reactions`,
                    ...channelInfo
                }, { quoted: msg });
                return;
            }

            const command = args[0].toLowerCase();
            
            if (command === 'on') {
                config.autoStatus = true;
                fs.writeFileSync(configPath, JSON.stringify(allSettings, null, 2));
                await King.sendMessage(chat, { 
                    text: '✅ Auto status view has been enabled!\nBot will now automatically view all contact statuses.',
                    ...channelInfo
                }, { quoted: msg });
            } else if (command === 'off') {
                config.autoStatus = false;
                fs.writeFileSync(configPath, JSON.stringify(allSettings, null, 2));
                await King.sendMessage(chat, { 
                    text: '❌ Auto status view has been disabled!\nBot will no longer automatically view statuses.',
                    ...channelInfo
                }, { quoted: msg });
            } else if (command === 'react') {
                if (!args[1]) {
                    await King.sendMessage(chat, { 
                        text: '❌ Please specify on/off for reactions!\nUse: .autostatus react on/off',
                        ...channelInfo
                    }, { quoted: msg });
                    return;
                }
                
                const reactCommand = args[1].toLowerCase();
                if (reactCommand === 'on') {
                    config.autoStatusReact = true;
                    fs.writeFileSync(configPath, JSON.stringify(allSettings, null, 2));
                    await King.sendMessage(chat, { 
                        text: '💫 Status reactions have been enabled!\nBot will now react to status updates.',
                        ...channelInfo
                    }, { quoted: msg });
                } else if (reactCommand === 'off') {
                    config.autoStatusReact = false;
                    fs.writeFileSync(configPath, JSON.stringify(allSettings, null, 2));
                    await King.sendMessage(chat, { 
                        text: '❌ Status reactions have been disabled!\nBot will no longer react to status updates.',
                        ...channelInfo
                    }, { quoted: msg });
                } else {
                    await King.sendMessage(chat, { 
                        text: '❌ Invalid reaction command! Use: .autostatus react on/off',
                        ...channelInfo
                    }, { quoted: msg });
                }
            } else {
                await King.sendMessage(chat, { 
                    text: '❌ Invalid command! Use:\n.autostatus on/off - Enable/disable auto status view\n.autostatus react on/off - Enable/disable status reactions',
                    ...channelInfo
                }, { quoted: msg });
            }
        } catch (error) {
            console.error('Error in autostatus command:', error);
            const chat = msg.chat || msg.key?.remoteJid;
            if (chat) {
                await King.sendMessage(chat, { 
                    text: '❌ Error occurred while managing auto status!\n' + error.message,
                    ...channelInfo
                }, { quoted: msg });
            }
        }
    }
};
