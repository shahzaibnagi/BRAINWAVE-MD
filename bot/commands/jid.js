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
    name: 'jid',
    aliases: ['id', 'getjid', 'chatid'],
    run: async (King, m, context) => {
        try {
            const { args, text, isCreator, reply } = context;
            const from = m.chat || m.key?.remoteJid;

            if (!isCreator) {
                return reply("⚠️ *Access Denied:* Only Owner can use the JID Extractor.");
            }

            let targetJid = from;
            let type = from.endsWith('@g.us') ? "Group" : from.endsWith('@newsletter') ? "Channel" : "Private Chat";
            let name = from.endsWith('@g.us') ? "Current Group" : from.endsWith('@newsletter') ? "Current Channel" : "Current Chat";

            const groupLinkMatch = text?.match(/(?:chat\.whatsapp\.com\/|wa\.me\/join\/)([a-zA-Z0-9]+)/i);
            const channelLinkMatch = text?.match(/(?:whatsapp\.com\/channel\/)([a-zA-Z0-9]+)/i);

            if (channelLinkMatch && channelLinkMatch[1]) {
                try {
                    await King.sendMessage(from, { react: { text: '🔍', key: m.key } });
                    const inviteCode = channelLinkMatch[1];
                    const chanInfo = await King.newsletterMetadata("invite", inviteCode);
                    targetJid = chanInfo.id;
                    name = chanInfo.name || "WhatsApp Channel";
                    type = "Channel (From Link)";
                } catch (e) {
                    return reply("❌ *Link Error:* Channel link either expired or invalid.");
                }
            } 
            else if (groupLinkMatch && groupLinkMatch[1]) {
                try {
                    await King.sendMessage(from, { react: { text: '🔍', key: m.key } });
                    const inviteCode = groupLinkMatch[1];
                    const grpInfo = await King.groupGetInviteInfo(inviteCode);
                    targetJid = grpInfo.id;
                    name = grpInfo.subject || "WhatsApp Group";
                    type = "Group (From Link)";
                } catch (e) {
                    return reply("❌ *Link Error:* Group link either expired, reset, or invalid.");
                }
            }
            else if (m.mentionedJid && m.mentionedJid.length > 0) {
                targetJid = m.mentionedJid[0];
                type = "User";
                name = "Mentioned User";
            } 
            else if (m.quoted) {
                targetJid = m.quoted.sender;
                type = "User";
                name = "Quoted User";

                const quotedContext = m.msg?.contextInfo?.quotedMessage;
                if (quotedContext) {
                    const rawContextInfo = 
                        quotedContext.extendedTextMessage?.contextInfo || 
                        quotedContext.imageMessage?.contextInfo || 
                        quotedContext.videoMessage?.contextInfo || 
                        quotedContext.audioMessage?.contextInfo;

                    if (rawContextInfo && rawContextInfo.forwardedNewsletterMessageInfo) {
                        targetJid = rawContextInfo.forwardedNewsletterMessageInfo.newsletterJid;
                        name = rawContextInfo.forwardedNewsletterMessageInfo.newsletterName || "Forwarded Channel";
                        type = "Channel (From Forward)";
                    }
                }
            } 
            else if (m.msg?.contextInfo?.forwardedNewsletterMessageInfo) {
                targetJid = m.msg.contextInfo.forwardedNewsletterMessageInfo.newsletterJid;
                name = m.msg.contextInfo.forwardedNewsletterMessageInfo.newsletterName || "Forwarded Channel";
                type = "Channel (Forwarded)";
            }

            if (targetJid && targetJid.includes(':')) {
                const parts = targetJid.split('@');
                if (parts.length === 2) {
                    targetJid = parts[0].split(':')[0] + '@' + parts[1];
                }
            }

            const jidCard = `╭╼━≪• 𝗝𝗜𝗗 𝗘𝗫𝗧𝗥𝗔𝗖𝗧𝗢𝗥 •≫━╾╮
┃
┃ 📌 *Type:* ${type}
┃ 🏷️ *Name:* ${name}
┃ 🆔 *JID:* ${targetJid}
┃
╰━━━━━━━━━━━━━━━╯

>   *B R A I N W A V E  M D*`;

            await King.sendMessage(from, { 
                text: jidCard,
                ...channelInfo 
            }, { quoted: m });

        } catch (error) {
            console.error("JID Command Error:", error);
            if (context.reply) {
                context.reply("❌ Engine Error while extracting JID.");
            }
        }
    }
};
