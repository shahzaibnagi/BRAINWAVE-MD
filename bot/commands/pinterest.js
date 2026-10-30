const fetch = require('node-fetch');

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
    name: 'pinterest',
    aliases: ['pin', 'pindl', 'pinterestdl'],
    run: async (King, m, context) => {
        try {
            const { args, reply } = context;

            if (!args[0]) {
                return reply('❌ *ERROR:* Please provide a valid Pinterest link!\n\n*Usage:*\n⚡ .pinterest https://pin.it/xyz123');
            }

            const url = args[0];
            const pinRegex = /pin\.it|pinterest\.com/i;

            if (!pinRegex.test(url)) {
                return reply('⚠️ *INVALID LINK:* Please provide an authentic Pinterest URL.');
            }

            await King.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

            const apiUrl = `https://docs.prexzyapis.com/download/pinterestV2?url=${encodeURIComponent(url)}`;
            
            const response = await fetch(apiUrl);
            
            let json;
            try {
                json = await response.json();
            } catch (parseError) {
                console.log('⚠️ Prexzy returned HTML instead of JSON');
                await King.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
                return reply(`❌ *API ROUTING ERROR*\n\nServer ne JSON ki jagah HTML page pakra diya hai (Unexpected token '<').\nIska matlab hai API backend par 'docs' wale link se direct requests block hain.`);
            }

            if (!json || !json.status || !json.data) {
                return reply('❌ *API ERROR:* The server did not respond correctly. Format mismatch.');
            }

            let isVideo = false;
            let mediaUrl = null;

            if (json.data.video) {
                mediaUrl = json.data.video;
                isVideo = true;
            } else if (json.data.image) {
                mediaUrl = json.data.image;
                isVideo = false;
            }

            if (!mediaUrl) {
                return reply('❌ *EXTRACTION FAILED:* Could not find media. The pin might be private or deleted.');
            }

            const uiCard = `╭╼━≪• 𝗣𝗜𝗡𝗧𝗘𝗥𝗘𝗦𝗧 𝗗𝗟 •≫━╾╮
┃
┃ ✅ *Status:* Download Success
┃ 📥 *Format:* ${isVideo ? 'MP4 Video 🎬' : 'HD Image 🖼️'}
┃
╰━━━━━━━━━━━━━━━╯

>   *B R A I N W A V E  M D*`;

            if (isVideo) {
                await King.sendMessage(m.chat, { 
                    video: { url: mediaUrl }, 
                    caption: uiCard,
                    ...channelInfo 
                }, { quoted: m });
            } else {
                await King.sendMessage(m.chat, { 
                    image: { url: mediaUrl }, 
                    caption: uiCard,
                    ...channelInfo 
                }, { quoted: m });
            }

            await King.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

        } catch (error) {
            console.error('Pinterest DL Error:', error);
            await King.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
            if (context.reply) context.reply('❌ *FATAL ERROR:* The downloader engine encountered a critical failure.');
        }
    }
};
