module.exports = {
    name: 'clonegc',
    run: async (King, m, { text, isCreator, prefix, reply }) => {
        
        if (!isCreator) return reply("⚠️ *Access Denied:* This command is reserved for the Bot Owner.");

        if (!m.isGroup && !text) {
            let usage = `*🛠️ CLONE-GC USAGE GUIDE*\n\n`
                + `Use this command to create an identical copy of a group (Name, Desc, Settings).\n\n`
                + `*Option A (Inside a Group):*\nType \`${prefix}clonegc\` to clone the current group.\n\n`
                + `*Option B (Via Link):*\nType \`${prefix}clonegc https://chat.whatsapp.com/xxxxx\`\n\n`
                + `_Note: Participants cannot be cloned due to WhatsApp security policies._`;
            return reply(usage);
        }

        let targetMetadata;
        try {
            if (text && text.includes('chat.whatsapp.com/')) {
                let code = text.split('chat.whatsapp.com/')[1];
                targetMetadata = await King.groupGetInviteInfo(code);
            } else if (m.isGroup) {
                targetMetadata = await King.groupMetadata(m.chat);
            } else {
                return reply(`❌ *Error:* Please provide a valid group link or use the command inside a group.`);
            }
        } catch (e) {
            return reply("❌ *Failed:* Could not retrieve group metadata. The link might be expired or the bot is restricted.");
        }

        reply(`⏳ *Cloning Process Started...*\n\n📂 *Target:* ${targetMetadata.subject}\n🛠️ *Status:* Initializing identical node...`);

        try {
            const newGc = await King.groupCreate(`Clone: ${targetMetadata.subject}`, [m.sender]);

            if (targetMetadata.desc) {
                await King.groupUpdateDescription(newGc.id, targetMetadata.desc);
            }

            if (targetMetadata.announce) await King.groupSettingUpdate(newGc.id, 'announcement');
            if (targetMetadata.restrict) await King.groupSettingUpdate(newGc.id, 'locked');

            const code = await King.groupInviteCode(newGc.id);
            
            let resultMessage = `✅ *NODE CLONED SUCCESSFULLY*\n\n`
                + `*🏷️ Name:* ${targetMetadata.subject}\n`
                + `*🔗 New Link:* https://chat.whatsapp.com/${code}\n\n`
                + `*⚙️ Settings Applied:* Description, Announcement Mode, and Edit Restrictions have been synced.\n\n`
                + `> _Owner has been promoted to Admin._`;

            await King.sendMessage(m.chat, { 
                text: resultMessage,
                contextInfo: {
                    forwardingScore: 2,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterName: "𝗕𝗥𝗔𝗜𝗡𝗪𝗔𝗩𝗘 𝗠𝗗 ⚡",
                        newsletterJid: "120363423958136871@newsletter"
                    }
                }
            }, { quoted: m });

        } catch (err) {
            console.error("Clone Engine Error:", err);
            reply("❌ *Critical Error:* Group was created but the system failed to sync metadata/settings.");
        }
    }
};
