module.exports = {
    name: 'ttsearch',
    alias: ['ttrandom'],
    category: 'downloader',
    desc: 'Searches and downloads 3 random TikTok videos based on a topic.',
    
    async run(King, m, { text, reply }) {
        
        if (!text) return reply('⚠️ *Syntax Error:*\n_Please provide a topic. Example: .ttrandom sad or .ttsearch anime_');

        reply(`🔍 *Searching & downloading 3 random TikTok videos about "${text}". Please wait...*`);

        try {
            const searchRes = await fetch(`https://apis.prexzyvilla.site/search/tiktoksearch?q=${encodeURIComponent(text)}`);
            const searchData = await searchRes.json();

            let videos = searchData.result || searchData.data || searchData;

            if (!videos || !Array.isArray(videos) || videos.length === 0) {
                return reply(`⚠️ *No videos found for the topic:* "${text}"`);
            }

            let randomVideos = videos.sort(() => 0.5 - Math.random()).slice(0, 3);

            for (let i = 0; i < randomVideos.length; i++) {
                let videoObj = randomVideos[i];

                let faultyLink = videoObj.play || videoObj.wmplay || JSON.stringify(videoObj);
                let idMatch = faultyLink.match(/\d{18,21}/); 
                
                if (!idMatch) {
                    console.log(`[Skip] Could not find Video ID in search result ${i}`);
                    continue; 
                }

                let videoId = idMatch[0];
                let realTiktokUrl = `https://www.tiktok.com/@tiktok/video/${videoId}`;

                const dlRes = await fetch(`https://apis.prexzyvilla.site/download/tiktokvideo?url=${encodeURIComponent(realTiktokUrl)}`);
                const dlData = await dlRes.json();

                let finalVideoUrl = dlData.result?.no_watermark 
                                 || dlData.data?.no_watermark 
                                 || dlData.data?.play 
                                 || dlData.url;

                if (!finalVideoUrl) {
                    console.log(`[Skip] Download API failed to provide a link for video ID ${videoId}`);
                    continue;
                }

                try {
                    const vidFetchRes = await fetch(finalVideoUrl, {
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                        }
                    });

                    if (!vidFetchRes.ok) throw new Error(`HTTP Error: ${vidFetchRes.status}`);

                    const arrayBuffer = await vidFetchRes.arrayBuffer();
                    const videoBuffer = Buffer.from(arrayBuffer);

                    await King.sendMessage(m.chat, {
                        video: videoBuffer, 
                        caption: `🎬 *Video ${i + 1} / 3*\n📝 *Topic:* ${text}\n\n> 𝗣𝗼𝘄𝗲𝗿𝗲𝗱 𝗯𝘆 𝗦𝗵𝗮𝗵𝘇𝗮𝗶𝗯 𝗧𝗲𝗰𝗵`
                    }, { quoted: m });

                } catch (bufferError) {
                    console.log(`[TTSEARCH ERROR] Video ${i + 1} skip ho gayi:`, bufferError.message);
                }

                await new Promise(resolve => setTimeout(resolve, 2500));
            }

        } catch (error) {
            console.error('TikTok Search & Download Error:', error);
            reply('❌ *System Fault:* An error occurred while fetching or downloading the videos.');
        }
    }
};
