const fs = require('fs');
const path = require('path');
const { Sticker, createSticker, StickerTypes } = require('wa-sticker-formatter');

module.exports = {
    name: 'steal',
    aliases: ['stickerthf', 'stickerwm', 'take', 'wm'],
    run: async (King, m, { args, prefix, command, reply }) => {
        
        const quoted = m.quoted ? m.quoted : null;
        if (!quoted) return reply(`⚠️ *Syntax Error:*\n_Reply to a sticker to steal/change its watermark._`);

        const tempDir = path.join(process.cwd(), 'temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        const getRandom = (ext) => {
            return `${Math.floor(Math.random() * 10000)}${Date.now()}${ext}`
        }

        let ahuh = args.join(' ').split('|');
        let satu = ahuh[0] ? ahuh[0] : (m.pushName || 'Brainwave MD');
        let dua = ahuh[1] ? ahuh[1] : (m.pushName || 'Shahzaib Tech');

        try {
            await King.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });
            
            let rawMediaName = path.join(tempDir, getRandom(''));
            let randomName = Math.floor(Math.random() * 10000000000).toString(); 
            let media = await King.downloadAndSaveMediaMessage(quoted, randomName);
            
            let jancok = new Sticker(media, {
                pack: satu,
                author: dua,
                type: StickerTypes.FULL, 
                categories: ['🤩', '🎉'], 
                id: '12345', 
                quality: 70, 
                background: '#FFFFFF00' 
            });

            let stok = path.join(tempDir, getRandom(".webp"));
            let nono = await jancok.toFile(stok);
            let nah = fs.readFileSync(nono);

            await King.sendMessage(m.chat, { sticker: nah }, { quoted: m });
            
            await King.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

            if (fs.existsSync(stok)) fs.unlinkSync(stok);
            if (fs.existsSync(media)) fs.unlinkSync(media);

        } catch (err) {
            console.error("Steal Command Error:", err);
            reply("❌ *System Fault:* Failed to process sticker. Ensure you replied to a valid media.");
        }
    }
}
