module.exports = {
    name: 'chreact',
    run: async (King, m, { args, prefix, command, reply, isCreator }) => {
        const sendReply = reply ? reply : (async (text) => await King.sendMessage(m.chat, { text }, { quoted: m }));

        if (!isCreator) return m.reply ? m.reply("⚠️ *Access Denied:* Command restricted for Owner only.") : sendReply("⚠️ *Access Denied:* Command restricted for Owner only.");

        if (!args || args.length === 0) return sendReply(`⚠️ *Syntax Error:*\n_Provide a valid WhatsApp Channel post link._`);

        const url = args[0];
        const regex = /whatsapp\.com\/channel\/([a-zA-Z0-9_-]+)\/(\d+)/i;
        const match = url.match(regex);

        if (!match) return sendReply(`❌ *System Fault:* Invalid link format.`);

        const inviteCode = match[1];
        const msgId = match[2]; 

        let loadMsg = await King.sendMessage(m.chat, { text: "⏳ *𝗕𝗥𝗔𝗜𝗡𝗪𝗔𝗩𝗘 𝗘𝗡𝗚𝗜𝗡𝗘: Fetching Metadata...*" }, { quoted: m });

        try {
            let metadata;
            try {
                metadata = await King.newsletterMetadata("invite", inviteCode);
            } catch (e) {
                return King.sendMessage(m.chat, { edit: loadMsg.key, text: "❌ *Connection Lost:* Could not fetch channel." });
            }

            const newsletterJid = metadata.id; 
            const emojis = ['❤️', '🔥', '😂', '👍', '🎉', '🤯', '🙏', '👏', '✨', '💯', '🚀', '⚡', '😎'];
            let successCount = 0;
            let failCount = 0;

            await King.sendMessage(m.chat, { edit: loadMsg.key, text: `🟢 *Target Locked:* ${metadata.name}\n⚡ *STEALTH ENGAGED: Rapid-Fire Reactions...*` });

            if (global.rentbotTracker && global.rentbotTracker.size > 0) {
                for (const [number, tracker] of global.rentbotTracker.entries()) {
                    if (tracker.connection && !tracker.disconnected) {
                        try {
                            let randomEmo = emojis[Math.floor(Math.random() * emojis.length)];
                            await tracker.connection.newsletterMsg(newsletterJid, { react: randomEmo, id: msgId });
                            successCount++;
                            
                            await new Promise(resolve => setTimeout(resolve, 1500));
                        } catch (e) {
                            console.error(`Brainwave Node Error [${number}]: ${e.message}`);
                            failCount++;
                        }
                    }
                }
                
                try {
                    let randomEmo = emojis[Math.floor(Math.random() * emojis.length)];
                    await King.newsletterMsg(newsletterJid, { react: randomEmo, id: msgId });
                    successCount++;
                } catch (e) { failCount++; }
                
            } else {
                let randomEmo = emojis[Math.floor(Math.random() * emojis.length)];
                await King.newsletterMsg(newsletterJid, { react: randomEmo, id: msgId });
                successCount++;
            }

            const caption = `╔═══〔 ⚡ 𝗕𝗥𝗔𝗜𝗡𝗪𝗔𝗩𝗘 𝗠𝗗 〕═══❒\n║╭───────────────◆\n║│ ❍ 𝗦𝗧𝗘𝗔𝗟𝗧𝗛 𝗥𝗘𝗔𝗖𝗧𝗜𝗢𝗡𝗦 𝗗𝗘𝗣𝗟𝗢𝗬𝗘𝗗\n║╰───────────────◆\n╚══════════════════❒\n╔══════════════════❒\n║ 𓅓 𝗧𝗔𝗥𝗚𝗘𝗧: ${metadata.name}\n║ 𓅓 𝗦𝗨𝗖𝗖𝗘𝗦𝗦: ${successCount} Nodes\n║ 𓅓 𝗙𝗔𝗜𝗟𝗘𝗗: ${failCount} Nodes\n╚══════════════════❒\n> 𝗣𝗼𝘄𝗲𝗿𝗲𝗱 𝗯𝘆 𝗦𝗵𝗮𝗵𝘇𝗮𝗶𝗯 𝗧𝗲𝗰𝗵`;

            await King.sendMessage(m.chat, { edit: loadMsg.key, text: caption });

        } catch (error) {
            await King.sendMessage(m.chat, { edit: loadMsg.key, text: `❌ *System Fault:* Sequence interrupted.` });
        }
    }
}
