const axios = require('axios');

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

const animeCommands = [
    'lurk', 'shoot', 'sleep', 'clap', 'shrug', 'stare', 'wave', 'poke', 
    'confused', 'smile', 'peck', 'wink', 'sip', 'blush', 'smug', 
    'tickle', 'yeet', 'think', 'highfive', 'feed', 'wag', 'bite', 
    'teehee', 'shocked', 'bleh', 'bored', 'nom', 'nya', 'yawn', 
    'facepalm', 'cuddle', 'kick', 'happy', 'carry', 'hug', 'kabedon', 
    'baka', 'bonk', 'pat', 'angry', 'spin', 'shake', 'run', 'nod', 
    'nope', 'kiss', 'dance', 'punch', 'handshake', 'slap', 'cry', 
    'lappillow', 'pout', 'blowkiss', 'handhold', 'salute', 'thumbsup', 
    'laugh', 'tableflip', 'neko', 'waifu', 'husbando', 'kitsune'
];

module.exports = {
    name: 'anime',
    aliases: animeCommands,
    run: async (King, m, context) => {
        try {
            const { command, isCreator, reply } = context;
            const chat = m.chat || m.key?.remoteJid;

            if (!isCreator) {
                return reply("⚠️ *Access Denied:* Only the System Administrator can authorize this visual sequence ⚡");
            }

            await King.sendMessage(chat, { react: { text: "⏳", key: m.key } });

            const res = await axios.get(`https://nekos.best/api/v2/${command}`);
            const data = res.data;
            
            if (data && data.results && data.results[0] && data.results[0].url) {
                const url = data.results[0].url;
                const animeName = data.results[0].anime_name || "Unknown Anime";

                if (url.endsWith('.gif')) {
                    await King.sendImageAsSticker(chat, url, m, { 
                        packname: "𝗕𝗥𝗔𝗜𝗡𝗪𝗔𝗩𝗘 𝗠𝗗", 
                        author: "𝗦𝗵𝗮𝗵𝘇𝗮𝗶𝗯 𝗧𝗲𝗰𝗵",
                        categories: ["anime", command]
                    });
                } else {
                    const uiCard = `╭╼━≪• 𝗔𝗡𝗜𝗠𝗘 𝗗𝗥𝗢𝗣 •≫━╾╮
┃
┃ 🎭 *Type:* ${command.charAt(0).toUpperCase() + command.slice(1)}
┃ 📺 *Anime:* ${animeName}
┃
╰━━━━━━━━━━━━━━━╯

>   *B R A I N W A V E  M D*`;
                    
                    await King.sendMessage(chat, { 
                        image: { url: url }, 
                        caption: uiCard,
                        ...channelInfo
                    }, { quoted: m });
                }
                
                await King.sendMessage(chat, { react: { text: "✅", key: m.key } });
            } else {
                throw new Error("Invalid API Response");
            }
        } catch (err) {
            console.error(`Error in Anime Engine [${context.command}]:`, err);
            const chat = m.chat || m.key?.remoteJid;
            await King.sendMessage(chat, { react: { text: "❌", key: m.key } });
            if (context.reply) context.reply(`❌ *FATAL ERROR:* The anime server is not responding correctly for ${context.command}.`);
        }
    }
};
