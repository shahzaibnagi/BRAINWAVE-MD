module.exports = {
    name: 'sticker',
    run: async (King, m, { args, prefix, command, reply }) => {
        const sendReply = reply ? reply : (async (text) => await King.sendMessage(m.chat, { text }, { quoted: m }));

        const isImage = m.mtype === 'imageMessage' || (m.quoted && m.quoted.mtype === 'imageMessage');

        if (!isImage) {
            return sendReply(`⚠️ *Syntax Error:*\n_Please reply to an image, or send an image with the caption \`${prefix}${command}\` to convert it into a sticker._`);
        }

        let loadMsg = await King.sendMessage(m.chat, { text: "⏳ *𝗕𝗥𝗔𝗜𝗡𝗪𝗔𝗩𝗘 𝗘𝗡𝗚𝗜𝗡𝗘: Extracting Image Data...*" }, { quoted: m });

        try {
            const targetMessage = m.mtype === 'imageMessage' ? m : m.quoted;
            
            const mediaBuffer = await targetMessage.download();

            await King.sendMessage(m.chat, { edit: loadMsg.key, text: `🟢 *Data Captured!*\n⚡ *Rendering EXIF Metadata & Converting to WebP...*` });

            await King.sendImageAsSticker(m.chat, mediaBuffer, m, { 
                packname: "⚡ 𝗕𝗥𝗔𝗜𝗡𝗪𝗔𝗩𝗘 𝗠𝗗", 
                author: "𝗦𝗵𝗮𝗵𝘇𝗮𝗶𝗯 𝗧𝗲𝗰𝗵" 
            });

            await King.sendMessage(m.chat, { edit: loadMsg.key, text: "✅ *Sticker Deployed Successfully*" });

        } catch (error) {
            console.error("Brainwave Sticker Error:", error);
            await King.sendMessage(m.chat, { edit: loadMsg.key, text: `❌ *System Fault:* Rendering sequence interrupted. ${error.message}` });
        }
    }
}
