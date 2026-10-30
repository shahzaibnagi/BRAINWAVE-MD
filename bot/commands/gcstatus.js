const { downloadContentFromMessage, prepareWAMessageMedia, generateWAMessageFromContent } = require('@whiskeysockets/baileys');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function postGroupStatus(King, groupId, quoted, times = 1, bgArgb = null) {
    console.log(`\n[🔍 TRACKER] Sending status to Group: ${groupId}`); 

    for (let i = 0; i < times; i++) {
        try {
            const imageMsg = quoted.imageMessage || quoted.msg?.imageMessage;
            const videoMsg = quoted.videoMessage || quoted.msg?.videoMessage;
            const textMsg = quoted.text || quoted.caption || quoted.conversation || quoted.extendedTextMessage?.text;

            if (imageMsg || videoMsg) {
                console.log(`[🔍 TRACKER] Media detect ho gaya. Downloading...`); 
                const stream = await downloadContentFromMessage(imageMsg || videoMsg, imageMsg ? 'image' : 'video');
                let buffer = Buffer.from([]);
                for await (const chunk of stream) {
                    buffer = Buffer.concat([buffer, chunk]);
                }

                console.log(`[🔍 TRACKER] Uploading Media to WhatsApp Server...`); 
                const preparedMedia = await prepareWAMessageMedia(
                    imageMsg ? { image: buffer } : { video: buffer }, 
                    { upload: King.waUploadToServer }
                );

                if (imageMsg) preparedMedia.imageMessage.caption = textMsg || '';
                else preparedMedia.videoMessage.caption = textMsg || '';

                console.log(`[🔍 TRACKER] Generating V2 Status Stanza...`); 
                const statusMsg = generateWAMessageFromContent(groupId, { groupStatusMessageV2: { message: preparedMedia } }, { userJid: King.user.id });
                
                console.log(`[🔍 TRACKER] Relaying message to WhatsApp...`); 
                await King.relayMessage(groupId, statusMsg.message, { messageId: statusMsg.key.id });
                console.log(`✅ [SUCCESS] Media Status Sent to ${groupId}!`); 

            } else if (textMsg) {
                console.log(`[🔍 TRACKER] Text Status detect ho gaya. Generating...`); 
                const ext = {
                    text: textMsg,
                    backgroundArgb: (bgArgb !== null && bgArgb !== undefined) ? bgArgb : 0xff1a1a2e,
                    font: 0
                };

                const statusMsg = generateWAMessageFromContent(groupId, {
                    groupStatusMessageV2: { message: { extendedTextMessage: ext } }
                }, { userJid: King.user.id });

                console.log(`[🔍 TRACKER] Relaying Text Status to WhatsApp...`); 
                await King.relayMessage(groupId, statusMsg.message, { messageId: statusMsg.key.id });
                console.log(`✅ [SUCCESS] Text Status Sent to ${groupId}!`); 
            }

            if (times > 1 && i < times - 1) await sleep(100);
            break;
        } catch (e) {
            console.error(`\n❌ [CRITICAL ERROR] WhatsApp ne block kiya! Wajah:`, e);
            break;
        }
    }
}

module.exports = {
    name: 'gcstatus',
    aliases: ['togcstatus', 'groupstatus'],
    run: async (King, m, { args, prefix, command, reply, isCreator }) => {
        
        if (!isCreator) return reply("⚠️ *Access Denied:* Only the bot owner can push Group Statuses.");

        if (!m.quoted) return reply(`⚠️ *Syntax Error:*\n_Reply to an image, video, or text message to push it to the Group Status.\nExample: ${prefix}${command}_`);

        let targetGroup = m.chat; 
        
        if (args[0] && args[0].endsWith('@g.us')) {
            targetGroup = args[0];
        }

        if (!targetGroup.endsWith('@g.us')) {
            return reply(`❌ *Invalid Target:*\n_This command must be used inside a group, or you must provide a valid Group JID._`);
        }

        try {
            await King.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

            await postGroupStatus(King, targetGroup, m.quoted, 1, 0xff1a1a2e);

            await King.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
            reply(`✅ *Group Status Pushed Successfully to:* ${targetGroup}`);

        } catch (error) {
            console.error("Command GCStatus Error:", error);
            reply("❌ *System Fault:* Could not push group status. Check console logs for tracker details.");
        }
    }
}
