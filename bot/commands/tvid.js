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
    name: 'tvid',
    aliases: ['tiktok5', 'tsearchall', 'bulktt'],
    run: async (King, m, context) => {
        const { args, reply } = context;

        if (!args[0]) {
            return reply('❌ *ERROR:* Please provide a search query!\n\n*Usage:*\n⚡ .tvid aesthetic status');
        }

        const searchQuery = args.join(" ");

        await King.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });
        await reply(`🔄 *Background Engine Active:*\nExtracting 5 videos for "${searchQuery}" in the background. You can continue using other commands!`);

        const processHeavyScraping = async () => {
            try {
                const apiUrl = `https://www.tikwm.com/api/feed/search?keywords=${encodeURIComponent(searchQuery)}&count=30`;
                const response = await fetch(apiUrl);
                const json = await response.json();

                if (!json || json.code !== 0 || !json.data || !json.data.videos || json.data.videos.length === 0) {
                    return await King.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
                }

                let allVideos = json.data.videos.sort(() => Math.random() - 0.5);
                const topVideos = allVideos.slice(0, 5);
                let successCount = 0;

                for (let i = 0; i < topVideos.length; i++) {
                    const videoUrl = topVideos[i].play;
                    if (!videoUrl) continue;

                    const uiCard = `╭╼━≪• 𝗧𝗜𝗞𝗧𝗢𝗞 𝗕𝗨𝗟𝗞 𝗗𝗟 •≫━╾╮\n┃\n┃ 🔢 *Video:* ${i + 1} of ${topVideos.length}\n┃ ✅ *Status:* Background DL\n┃\n╰━━━━━━━━━━━━━━━╯\n>   *B R A I N W A V E  M D*`;

                    await King.sendMessage(m.chat, { 
                        video: { url: videoUrl }, caption: uiCard, ...channelInfo 
                    }, { quoted: m });

                    successCount++;
                    await new Promise(resolve => setTimeout(resolve, 2500));
                }

                if (successCount > 0) await King.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
                else await King.sendMessage(m.chat, { react: { text: "❌", key: m.key } });

            } catch (error) {
                console.error('TikTok Background Error:', error);
                await King.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
            }
        };

        processHeavyScraping();
    }
};
