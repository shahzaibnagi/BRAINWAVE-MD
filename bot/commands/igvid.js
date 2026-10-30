const google = require('googlethis');
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
    name: 'igvid',
    aliases: ['igsearch', 'instavid', 'igbulk'],
    run: async (King, m, context) => {
        const { args, reply } = context;

        if (!args[0]) {
            return reply('❌ *ERROR:* Please provide a search query!\n\n*Usage:*\n⚡ .ivid aesthetic status');
        }

        const searchQuery = args.join(" ");

        await King.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
        await reply(`🔄 *Custom Bypass Engine Active:*\nHunting Instagram in the background. Feel free to use other commands!`);

        const processHeavyIGScraping = async () => {
            try {
                const options = { page: 0, safe: false, additional_params: { hl: 'en' } };
                const response = await google.search(`site:instagram.com/reel/ ${searchQuery}`, options);
                
                let reelLinks = response.results.map(res => res.url).filter(url => url.includes('instagram.com/reel/'));

                if (!reelLinks || reelLinks.length === 0) {
                    return await King.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
                }

                reelLinks = reelLinks.sort(() => Math.random() - 0.5);
                const topReels = reelLinks.slice(0, 5);
                let successCount = 0;

                for (let i = 0; i < topReels.length; i++) {
                    const igLink = topReels[i];
                    try {
                        const apiUrl = `https://prexzyapis.com/download/ig2?url=${encodeURIComponent(igLink)}`;
                        const apiResponse = await fetch(apiUrl);
                        const json = await apiResponse.json();

                        let videoUrl = null;
                        if (json.data && Array.isArray(json.data) && json.data.length > 0) videoUrl = json.data[0].url || json.data[0];
                        else if (json.result && Array.isArray(json.result) && json.result.length > 0) videoUrl = json.result[0].url || json.result[0];
                        else if (json.data && json.data.url) videoUrl = json.data.url;
                        else if (json.result && json.result.url) videoUrl = json.result.url;
                        else if (json.url) videoUrl = json.url;

                        if (!videoUrl) continue;

                        const uiCard = `╭╼━≪• 𝗜𝗡𝗦𝗧𝗔𝗚𝗥𝗔𝗠 𝗕𝗨𝗟𝗞 𝗗𝗟 •≫━╾╮\n┃\n┃ 🔢 *Video:* ${successCount + 1} of 5\n┃ ✅ *Status:* Background Bypass\n┃\n╰━━━━━━━━━━━━━━━╯\n> 🧠 *B R A I N W A V E  M D*`;

                        await King.sendMessage(m.chat, { 
                            video: { url: videoUrl }, caption: uiCard, ...channelInfo 
                        }, { quoted: m });

                        successCount++;
                        await new Promise(resolve => setTimeout(resolve, 3000));

                    } catch (dlError) {
                        continue; 
                    }
                }

                if (successCount > 0) await King.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
                else await King.sendMessage(m.chat, { react: { text: "❌", key: m.key } });

            } catch (error) {
                console.error('Instagram Background Error:', error);
                await King.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
            }
        };

        processHeavyIGScraping();
    }
};
