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

const prexzyEffects = [
    'glitchtext', 'writetext', 'advancedglow', 'typographytext',
    'pixelglitch', 'neonglitch', 'deletingtext', 'blackpinkstyle',
    'glowingtext', 'underwatertext', 'logomaker', 'cartoonstyle',
    'papercutstyle', 'watercolortext', 'effectclouds', 'blackpinklogo',
    'gradienttext', 'summerbeach', 'luxurygold', 'multicoloredneon',
    'sandsummer', 'galaxywallpaper', 'style1917', 'makingneon',
    'royaltext', 'freecreate'
];

module.exports = {
    name: 'textmaker',
    aliases: prexzyEffects,
    run: async (King, m, context) => {
        try {
            const { args, command, reply } = context;

            const userText = args.join(" ");

            if (!userText) {
                let menuCard = `╭╼━≪• 𝗧𝗘𝗫𝗧 𝗠𝗔𝗞𝗘𝗥𝗦 •≫━╾╮\n┃\n┃ ❌ *Missing Text!*\n┃ *Usage:* .${command} <your text>\n┃ *Example:* .${command} BrainWave\n┃\n┃ 🎨 *Available Styles:*\n`;
                
                menuCard += `┃ ⚡ .glitchtext\n┃ ⚡ .luxurygold\n┃ ⚡ .neonglitch\n┃ ⚡ .blackpinkstyle\n┃ ⚡ .galaxywallpaper\n┃ ⚡ .watercolortext\n┃ ⚡ .papercutstyle\n┃ *(and 19 more...)*\n╰━━━━━━━━━━━━━━━╯\n\n> 🧠 *B R A I N W A V E  M D*`;
                
                return reply(menuCard);
            }

            await King.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

            const apiUrl = `https://docs.prexzyapis.com/${command}?text=${encodeURIComponent(userText)}`;

            const response = await fetch(apiUrl);
            
            const contentType = response.headers.get('content-type') || '';
            let imagePayload;

            if (contentType.includes('application/json')) {
                const json = await response.json();
                
                if (!json || (!json.status && json.statusCode !== 200)) {
                    await King.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
                    return reply('❌ *API ERROR:* The server failed to generate the text image.');
                }
                
                const extractedUrl = json.data?.url || json.data?.image || json.result?.url || json.url;
                
                if (!extractedUrl) {
                    return reply('❌ *EXTRACTION FAILED:* Could not find the generated image link.');
                }
                imagePayload = { url: extractedUrl };

            } else if (contentType.includes('image/')) {
                const buffer = await response.buffer();
                imagePayload = buffer;

            } else {
                console.log(`⚠️ TextMaker API Error [${command}]: Content-Type:`, contentType);
                await King.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
                return reply(`❌ *API ROUTING ERROR*\n\nEndpoint '${command}' returned an invalid format: ${contentType.split(';')[0]}\n(The server might be down or returning a webpage).`);
            }

            const uiCard = `╭╼━≪• 𝗔𝗥𝗧 𝗚𝗘𝗡𝗘𝗥𝗔𝗧𝗢𝗥 •≫━╾╮
┃
┃ 🎨 *Style:* ${command.charAt(0).toUpperCase() + command.slice(1)}
┃ 📝 *Text:* ${userText}
┃ ✅ *Status:* Rendered Successfully
┃
╰━━━━━━━━━━━━━━━╯

> 🧠 *B R A I N W A V E  M D*`;

            await King.sendMessage(m.chat, { 
                image: imagePayload, 
                caption: uiCard,
                ...channelInfo 
            }, { quoted: m });

            await King.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

        } catch (error) {
            console.error(`TextMaker Engine Error [${context.command}]:`, error);
            
            await King.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
            if (context.reply) context.reply('❌ *FATAL ERROR:* The rendering engine crashed while processing your text.');
        }
    }
};
