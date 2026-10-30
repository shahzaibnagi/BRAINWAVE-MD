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
    name: 'ssweb',
    aliases: ['ss', 'screenshot', 'webss'],
    run: async (King, m, context) => {
        try {
            const { args, reply } = context;

            if (!args[0]) {
                return reply('❌ *ERROR:* Please provide a valid website link!\n\n*Usage:*\n⚡ .ssweb https://github.com');
            }

            let targetUrl = args[0];
            
            if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
                targetUrl = 'https://' + targetUrl; 
            }

            const urlRegex = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/i;
            if (!urlRegex.test(targetUrl)) {
                return reply('⚠️ *INVALID LINK:* Please provide a valid website URL.');
            }

            await King.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

            const apiUrl = `https://docs.prexzyapis.com/ssweb/screenshotLayer?url=${encodeURIComponent(targetUrl)}`;

            const response = await fetch(apiUrl);
            
            const contentType = response.headers.get('content-type') || '';
            let imagePayload;

            if (contentType.includes('application/json')) {
                const json = await response.json();
                
                if (!json || (!json.status && json.statusCode !== 200)) {
                    await King.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
                    return reply('❌ *API ERROR:* The server failed to generate a screenshot.');
                }
                
                const extractedUrl = json.data?.image || json.result?.url || json.url || json.data?.url;
                
                if (!extractedUrl) {
                    return reply('❌ *EXTRACTION FAILED:* JSON received but no image URL was found.');
                }
                imagePayload = { url: extractedUrl };

            } else if (contentType.includes('image/')) {
                const buffer = await response.buffer();
                imagePayload = buffer;

            } else {
                console.log('⚠️ SSWeb API Error: Server sent content-type:', contentType);
                await King.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
                return reply(`❌ *API ROUTING ERROR*\n\nServer returned an invalid format: ${contentType.split(';')[0]}\n(This usually means the API endpoint blocked the request or sent a webpage).`);
            }

            const cleanHost = targetUrl.replace(/^https?:\/\//, '').split('/')[0];
            const uiCard = `╭╼━≪• 𝗪𝗘𝗕 𝗦𝗖𝗥𝗘𝗘𝗡𝗦𝗛𝗢𝗧 •≫━╾╮
┃
┃ 🎯 *Target:* ${cleanHost}
┃ ✅ *Status:* Captured Successfully
┃
╰━━━━━━━━━━━━━━━╯

>   *B R A I N W A V E  M D*`;

            await King.sendMessage(m.chat, { 
                image: imagePayload, 
                caption: uiCard,
                ...channelInfo 
            }, { quoted: m });

            await King.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

        } catch (error) {
            console.error('SSWeb Engine Error:', error);
            
            await King.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
            if (context.reply) context.reply('❌ *FATAL ERROR:* The screenshot engine encountered a critical failure.');
        }
    }
};
