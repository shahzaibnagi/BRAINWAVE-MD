module.exports = {
    name: 'ping',
    run: async (King, m, { pushname }) => {
        let name = pushname || m.pushName || "Master"; 
        
        await King.sendMessage(m.chat, {
            text: `🏓 *PONG!*\n\n⚡ 𝗕𝗥𝗔𝗜𝗡𝗪𝗔𝗩𝗘 𝗘𝗡𝗚𝗜𝗡𝗘 is online and listening, ${name}!`,
            contextInfo: {
                forwardingScore: 2,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterName: "𝗕𝗥𝗔𝗜𝗡𝗪𝗔𝗩𝗘 𝗠𝗗 ⚡",
                    newsletterJid: "120363429360598866@newsletter"
                }
            }
        }, { quoted: m });
    }
};
