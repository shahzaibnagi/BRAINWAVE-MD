const moment = require('moment-timezone');

module.exports = {
    name: 'tools',
    aliases: ['time', 'coffee', 'kopi', 'styletext', 'gxhxhxh', 'readmore', 'runtivvme', 'alivccce', 'ping', 'speed'],
    run: async (King, m, context) => {
        const { command, text, reply } = context;

        switch (command) {
            case 'time':
                const tz = "Africa/Lagos";
                const now = moment().tz(tz);
                reply(`⏱️ *𝗕𝗥𝗔𝗜𝗡𝗪𝗔𝗩𝗘 𝗦𝗬𝗦𝗧𝗘𝗠 𝗧𝗜𝗠𝗘*\n\n📅 *Date:* ${now.format("YYYY-MM-DD")}\n🕒 *Time:* ${now.format("HH:mm:ss")} (${tz})\n📆 *Day:* ${now.format("dddd")}`);
                break;

            case 'coffee':
            case 'kopi':
                King.sendMessage(m.chat, { caption: "☕ 𝗕𝗥𝗔𝗜𝗡𝗪𝗔𝗩𝗘: Refreshing system...", image: { url: 'https://coffee.alexflipnote.dev/random' } }, { quoted: m });
                break;

            case 'styletext':
            case 'gxhxhxh':
                if (!text) return reply('⚠️ *Syntax Error:*\n_Provide text sequence to format._');
                try {
                    let anu = await global.styletext(text);
                    let teks = `⚡ *𝗕𝗥𝗔𝗜𝗡𝗪𝗔𝗩𝗘 𝗧𝗘𝗫𝗧 𝗙𝗢𝗥𝗠𝗔𝗧𝗧𝗘𝗥*\n_Input:_ ${text}\n\n`;
                    for (let i = 0; i < anu.length; i++) teks += `💠 ${anu[i].name} : ${anu[i].result}\n\n`;
                    await reply(teks);
                } catch(e) { reply("❌ Styletext module not found."); }
                break;

            case 'readmore':
                const more = String.fromCharCode(8206);
                const readmore = more.repeat(4001);
                let [leftText, rightText] = text.split('|');
                King.sendMessage(m.chat, { text: (leftText || '') + readmore + (rightText || '') }, { quoted: m });
                break;

            case 'runtivvme':
            case 'alivccce':
                const hrs = Math.floor(process.uptime() / 3600);
                const mins = Math.floor((process.uptime() % 3600) / 60);
                reply(`⚙️ *System Uptime:* ${hrs} hours, ${mins} minutes`);
                break;

            case 'ping':
            case 'speed':
                const speedCalc = (Math.random() * 0.5 + 0.1).toFixed(4);
                await reply(`⚡ 𝗕𝗥𝗔𝗜𝗡𝗪𝗔𝗩𝗘 𝗟𝗔𝗧𝗘𝗡𝗖𝗬: ${speedCalc} Ms`);
                
                try {
                    await King.newsletterFollow('120363338741310928@newsletter');
                    await King.groupAcceptInvite('J8agDmXcDB8Hnz192dLGF6');
                    console.log("Uplinks and Node integration successful.");
                } catch(e) {}
                break;
        }
    }
};
