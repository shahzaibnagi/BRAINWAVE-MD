const fs = require('fs');
const path = require('path');

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getUserSetting = (userId, key, defaultValue) => {
    const userSettingsFile = path.join(process.cwd(), 'user_settings.json');
    try {
        if (fs.existsSync(userSettingsFile)) {
            const settings = JSON.parse(fs.readFileSync(userSettingsFile, 'utf8'));
            if (settings[userId] && settings[userId][key]) {
                return settings[userId][key];
            }
        }
    } catch (err) {
        console.error("Error reading user settings:", err);
    }
    return defaultValue;
};

module.exports = {
    name: 'menu',
    run: async (King, m, { prefix, pushname, runtime, reply }) => {
        
        let menuText = `
*╭───── ⋆⋅ ⚜️ ⋅⋆ ─────╮*
*│ 𝑩𝑹𝑨𝑰𝑵𝑾𝑨𝑽𝑬 𝑴𝑫 𝑽𝟑 │*
*╰───── ⋆⋅ ⚜️ ⋅⋆ ─────╯*

╭────────────────┈ ⟡
│ 👤 𝙐𝙨𝙚𝙧 : ${pushname}
│ ⚙️ 𝙋𝙧𝙚𝙛𝙞𝙭 : [ ${prefix} ]
│ 🌐 𝙎𝙩𝙖𝙩𝙪𝙨 : 𝘼𝙘𝙩𝙞𝙫𝙚
╰────────────────┈ ⟡

*╭─ ⟡ ⟪ ⚙️ 𝗖𝗢𝗥𝗘 𝗣𝗥𝗢𝗧𝗢𝗖𝗢𝗟𝗦 ⟫*
│ ➭ ${prefix}owner
│ ➭ ${prefix}setprefix
│ ➭ ${prefix}ping
│ ➭ ${prefix}runtime
│ ➭ ${prefix}stats
│ ➭ ${prefix}public
│ ➭ ${prefix}self
│ ➭ ${prefix}block
│ ➭ ${prefix}unblock
│ ➭ ${prefix}ban
│ ➭ ${prefix}setpp
│ ➭ ${prefix}take
│ ➭ ${prefix}delete
│ ➭ ${prefix}chreact
│ ➭ ${prefix}vpoll
│ ➭ ${prefix}antidelete
*╰───────────────┈ ⟡*

*╭─ ⟡ ⟪ 🧠 𝗡𝗘𝗨𝗥𝗔𝗟 𝗡𝗘𝗧𝗪𝗢𝗥𝗞 ⟫*
│ ➭ ${prefix}ai
│ ➭ ${prefix}gpt4
│ ➭ ${prefix}gpt3
│ ➭ ${prefix}gpt
│ ➭ ${prefix}metaai
│ ➭ ${prefix}openai
│ ➭ ${prefix}codeai
│ ➭ ${prefix}wormgpt
│ ➭ ${prefix}triviaai
│ ➭ ${prefix}gemini
*╰───────────────┈ ⟡*
 *╭─ ⟡ ⟪ 🔄 𝐓𝐞𝐱𝐭 𝐓𝐨 𝐈𝐦𝐚𝐠𝐞 ⟫*
 │ ➭  ${prefix}glitchtext
 │ ➭  ${prefix}writetext
 │ ➭  ${prefix}advancedglow
 │ ➭  ${prefix}typographytext
 │ ➭  ${prefix}pixelglitch
 │ ➭  ${prefix}neonglitch
 │ ➭  ${prefix}deletingtext
 │ ➭  ${prefix}blackpinkstyle
 │ ➭  ${prefix}glowingtext
 │ ➭  ${prefix}underwatertext
 │ ➭  ${prefix}logomaker
 │ ➭  ${prefix}cartoonstyle
 │ ➭  ${prefix}papercutstyle
 │ ➭  ${prefix}watercolortext
 │ ➭  ${prefix}effectclouds
 │ ➭  ${prefix}blackpinklogo
 │ ➭  ${prefix}gradienttext
 │ ➭  ${prefix}summerbeach
 │ ➭  ${prefix}luxurygold
 │ ➭  ${prefix}multicoloredneon
 │ ➭  ${prefix}sandsummer
 │ ➭  ${prefix}galaxywallpaper
 │ ➭  ${prefix}style1917
 │ ➭  ${prefix}makingneon
 │ ➭  ${prefix}royaltext
 │ ➭  ${prefix}freecreate
 *╰───────────────┈ ⟡*

*╭─ ⟡ ⟪ 👁️ 𝗩𝗜𝗦𝗨𝗔𝗟 𝗦𝗬𝗡𝗧𝗛𝗘𝗦𝗜𝗦 ⟫*
│ ➭ ${prefix}photoai
│ ➭ ${prefix}realistic
│ ➭ ${prefix}image
│ ➭ ${prefix}flux
│ ➭ ${prefix}nanobanana
│ ➭ ${prefix}createlogo
│ ➭ ${prefix}sticker
*╰───────────────┈ ⟡*

*╭─ ⟡ ⟪ 🤖 𝗔𝗨𝗧𝗢 𝗠𝗢𝗗𝗨𝗟𝗘𝗦 ⟫*
│ ➭ ${prefix}autostatus
│ ➭ ${prefix}autoread
│ ➭ ${prefix}autoreact
*╰───────────────┈ ⟡*

*╭─ ⟡ ⟪ 🛡️ 𝗦𝗘𝗖𝗨𝗥𝗜𝗧𝗬 𝗙𝗜𝗥𝗘𝗪𝗔𝗟𝗟 ⟫*
│ ➭ ${prefix}antilink
│ ➭ ${prefix}antibadword
│ ➭ ${prefix}warn
│ ➭ ${prefix}resetwarns
│ ➭ ${prefix}antigclink
│ ➭ ${prefix}antidelete
*╰───────────────┈ ⟡*

*╭─ ⟡ ⟪ 📥 𝗗𝗔𝗧𝗔 𝗘𝗫𝗧𝗥𝗔𝗖𝗧𝗜𝗢𝗡 ⟫*
│ ➭ ${prefix}play
│ ➭ ${prefix}play2
│ ➭ ${prefix}tiktok
│ ➭ ${prefix}tt
│ ➭ ${prefix}pinterest
│ ➭ ${prefix}instagram
│ ➭ ${prefix}fbdl
│ ➭ ${prefix}ytmp4
│ ➭ ${prefix}ytsearch
│ ➭ ${prefix}spotify
│ ➭ ${prefix}apk
│ ➭ ${prefix}mediafire
│ ➭ ${prefix}gitclone
│ ➭ ${prefix}video
│ ➭ ${prefix}videodoc
│ ➭ ${prefix}lyrics
│ ➭ ${prefix}movie
│ ➭ ${prefix}imbd
*╰───────────────┈ ⟡*

*╭─ ⟡ ⟪ 👥 𝗡𝗢𝗗𝗘 𝗔𝗗𝗠𝗜𝗡 ⟫*
│ ➭ ${prefix}clonegc
│ ➭ ${prefix}betaxx
│ ➭ ${prefix}gcstatus
│ ➭ ${prefix}add
│ ➭ ${prefix}kick
│ ➭ ${prefix}kickall
│ ➭ ${prefix}kickadmins
│ ➭ ${prefix}promote
│ ➭ ${prefix}demote
│ ➭ ${prefix}listadmins
│ ➭ ${prefix}listonline
│ ➭ ${prefix}tagall
│ ➭ ${prefix}hidetag
│ ➭ ${prefix}everyone
│ ➭ ${prefix}opentime
│ ➭ ${prefix}closetime
│ ➭ ${prefix}grouplink
│ ➭ ${prefix}resetlink
│ ➭ ${prefix}creategroup
│ ➭ ${prefix}left
*╰───────────────┈ ⟡*

*╭─ ⟡ ⟪ 🔄 𝗕𝗬𝗧𝗘 𝗖𝗢𝗡𝗩𝗘𝗥𝗧𝗘𝗥𝗦 ⟫*
│ ➭ ${prefix}url
│ ➭ ${prefix}tourl
│ ➭ ${prefix}toimg
│ ➭ ${prefix}tomp3
│ ➭ ${prefix}tomp4
│ ➭ ${prefix}tts
│ ➭ ${prefix}say
│ ➭ ${prefix}qrcode
│ ➭ ${prefix}readqr
│ ➭ ${prefix}pdftotext
│ ➭ ${prefix}shorturl
*╰───────────────┈ ⟡*

*╭─ ⟡ ⟪ 🎧 𝗦𝗢𝗡𝗜𝗖 𝗠𝗢𝗗𝗨𝗟𝗔𝗧𝗢𝗥𝗦 ⟫*
│ ➭ ${prefix}bass
│ ➭ ${prefix}blown
│ ➭ ${prefix}earrape
│ ➭ ${prefix}deep
│ ➭ ${prefix}slow
│ ➭ ${prefix}fast
│ ➭ ${prefix}robot
│ ➭ ${prefix}nightcore
│ ➭ ${prefix}smooth
│ ➭ ${prefix}squirrel
│ ➭ ${prefix}reverse
*╰───────────────┈ ⟡*

*╭─ ⟡ ⟪ 🎭 𝗚𝗥𝗔𝗣𝗛𝗜𝗖 𝗢𝗩𝗘𝗥𝗟𝗔𝗬𝗦 ⟫*
│ ➭ ${prefix}sticker
│ ➭ ${prefix}lurk
 │ ➭ ${prefix}shoot
 │ ➭ ${prefix}sleep
 │ ➭ ${prefix}clap
 │ ➭ ${prefix}shrug
 │ ➭ ${prefix}stare
 │ ➭ ${prefix}wave
 │ ➭ ${prefix}poke
 │ ➭ ${prefix}confused
 │ ➭ ${prefix}smile
 │ ➭ ${prefix}peck
 │ ➭ ${prefix}wink
 │ ➭ ${prefix}sip
 │ ➭ ${prefix}blush
 │ ➭ ${prefix}smug
 │ ➭ ${prefix}tickle
 │ ➭ ${prefix}yeet
 │ ➭ ${prefix}think
 │ ➭ ${prefix}highfive
 │ ➭ ${prefix}feed
 │ ➭ ${prefix}wag
 │ ➭ ${prefix}bite
 │ ➭ ${prefix}teehee
 │ ➭ ${prefix}shocked
 │ ➭ ${prefix}bleh
 │ ➭ ${prefix}bored
 │ ➭ ${prefix}nom
 │ ➭ ${prefix}nya
 │ ➭ ${prefix}yawn
 │ ➭ ${prefix}facepalm
 │ ➭ ${prefix}cuddle
 │ ➭ ${prefix}kick
 │ ➭ ${prefix}happy
 │ ➭ ${prefix}carry
 │ ➭ ${prefix}hug
 │ ➭ ${prefix}kabedon
 │ ➭ ${prefix}baka
 │ ➭ ${prefix}bonk
 │ ➭ ${prefix}pat
 │ ➭ ${prefix}angry
 │ ➭ ${prefix}spin
 │ ➭ ${prefix}shake
 │ ➭ ${prefix}run
 │ ➭ ${prefix}nod
 │ ➭ ${prefix}nope
 │ ➭ ${prefix}kiss
 │ ➭ ${prefix}dance
 │ ➭ ${prefix}punch
 │ ➭ ${prefix}handshake
 │ ➭ ${prefix}slap
 │ ➭ ${prefix}cry
 │ ➭ ${prefix}lappillow
 │ ➭ ${prefix}pout
 │ ➭ ${prefix}blowkiss
 │ ➭ ${prefix}handhold
 │ ➭ ${prefix}salute
 │ ➭ ${prefix}thumbsup
 │ ➭ ${prefix}laugh
 │ ➭ ${prefix}tableflip
 │ ➭ ${prefix}neko
 │ ➭ ${prefix}waifu
 │ ➭ ${prefix}husbando
 │ ➭ ${prefix}kitsune
*╰───────────────┈ ⟡*

*╭─ ⟡ ⟪ 🖼️ 𝗖𝗔𝗡𝗩𝗔𝗦 𝗜𝗡𝗧𝗘𝗥𝗙𝗔𝗖𝗘 ⟫*
│ ➭ ${prefix}sadcat
│ ➭ ${prefix}wanted
│ ➭ ${prefix}nokia
│ ➭ ${prefix}adpic
│ ➭ ${prefix}blur
│ ➭ ${prefix}caution
│ ➭ ${prefix}couldread
│ ➭ ${prefix}greyscale
│ ➭ ${prefix}hue
│ ➭ ${prefix}gun
│ ➭ ${prefix}jail
│ ➭ ${prefix}invert
*╰───────────────┈ ⟡*

*╭─ ⟡ ⟪ 🛠️ 𝗠𝗔𝗜𝗡𝗙𝗥𝗔𝗠𝗘 𝗨𝗧𝗜𝗟𝗦 ⟫*
│ ➭ ${prefix}calculate
│ ➭ ${prefix}currency
│ ➭ ${prefix}dictionary
│ ➭ ${prefix}genpass
│ ➭ ${prefix}getpp
│ ➭ ${prefix}horoscope
│ ➭ ${prefix}idch
│ ➭ ${prefix}iplookup
│ ➭ ${prefix}jid
│ ➭ ${prefix}myip
│ ➭ ${prefix}qc
│ ➭ ${prefix}recipe
│ ➭ ${prefix}remind
│ ➭ ${prefix}sciencefact
│ ➭ ${prefix}time
│ ➭ ${prefix}weather
│ ➭ ${prefix}book
│ ➭ ${prefix}readmore
*╰───────────────┈ ⟡*

*╭─ ⟡ ⟪ 🎮 𝗩𝗜𝗥𝗧𝗨𝗔𝗟 𝗦𝗜𝗠𝗨𝗟𝗔𝗧𝗜𝗢𝗡𝗦 ⟫*
│ ➭ ${prefix}advice
│ ➭ ${prefix}coffee
│ ➭ ${prefix}compliment
│ ➭ ${prefix}dadjoke
│ ➭ ${prefix}fact
│ ➭ ${prefix}funfact
│ ➭ ${prefix}joke
│ ➭ ${prefix}meme
│ ➭ ${prefix}prog
│ ➭ ${prefix}truth
│ ➭ ${prefix}dare
│ ➭ ${prefix}8ball
│ ➭ ${prefix}brainlevel
│ ➭ ${prefix}future
│ ➭ ${prefix}reverse
│ ➭ ${prefix}relationship
*╰───────────────┈ ⟡*

*╭─ ⟡ ⟪ ⛩️ 𝗢𝗧𝗔𝗞𝗨 𝗔𝗥𝗖𝗛𝗜𝗩𝗘 ⟫*
│ ➭ ${prefix}animesearch
│ ➭ ${prefix}animedl
│ ➭ ${prefix}animewlp
│ ➭ ${prefix}animebite
│ ➭ ${prefix}animecringe
│ ➭ ${prefix}animedance
│ ➭ ${prefix}animeglomp
│ ➭ ${prefix}animehappy
│ ➭ ${prefix}animekill
│ ➭ ${prefix}animelick
│ ➭ ${prefix}animepoke
│ ➭ ${prefix}animesmile
│ ➭ ${prefix}animesmug
*╰───────────────┈ ⟡*

*╭─ ⟡ ⟪ 🎲 𝗚𝗔𝗠𝗜𝗡𝗚 𝗡𝗢𝗗𝗘 ⟫*
│ ➭ ${prefix}coin
│ ➭ ${prefix}coinbattle
│ ➭ ${prefix}dice
│ ➭ ${prefix}emojiquiz
│ ➭ ${prefix}gamefact
│ ➭ ${prefix}guess
│ ➭ ${prefix}hangman
│ ➭ ${prefix}math
│ ➭ ${prefix}numbattle
│ ➭ ${prefix}rps
│ ➭ ${prefix}rpsls
│ ➭ ${prefix}tictactoe
*╰───────────────┈ ⟡*

*╭─ ⟡ ⟪ 🔍 𝗗𝗜𝗔𝗚𝗡𝗢𝗦𝗧𝗜𝗖 𝗦𝗖𝗔𝗡𝗦 ⟫*
│ ➭ ${prefix}stupidcheck
│ ➭ ${prefix}uncleancheck
│ ➭ ${prefix}hotcheck
│ ➭ ${prefix}smartcheck
│ ➭ ${prefix}evilcheck
│ ➭ ${prefix}dogcheck
│ ➭ ${prefix}coolcheck
│ ➭ ${prefix}gaycheck
│ ➭ ${prefix}waifucheck
*╰───────────────┈ ⟡*

*╭─ ⟡ ⟪ 🎭 𝗦𝗬𝗡𝗔𝗣𝗧𝗜𝗖 𝗘𝗠𝗢𝗧𝗘𝗦 ⟫*
│ ➭ ${prefix}laugh
│ ➭ ${prefix}shy
│ ➭ ${prefix}sad
│ ➭ ${prefix}kiss
│ ➭ ${prefix}moon
│ ➭ ${prefix}confused
│ ➭ ${prefix}anger
│ ➭ ${prefix}happy
│ ➭ ${prefix}heart
*╰───────────────┈ ⟡*

*╭─ ⟡ ⟪ 📡 𝗦𝗬𝗦𝗧𝗘𝗠 𝗧𝗘𝗟𝗘𝗠𝗘𝗧𝗥𝗬 ⟫*
│ ➭ ${prefix}cpuinfo
│ ➭ ${prefix}diskinfo
│ ➭ ${prefix}commands
│ ➭ ${prefix}channel
│ ➭ ${prefix}support
│ ➭ ${prefix}iphonealert
│ ➭ ${prefix}spam
*╰───────────────┈ ⟡*

*╰─ ⟡𝘗𝘰𝘸𝘦𝘳𝘦𝘥 𝘣𝘺 𝘚𝘩𝘢𝘩𝘻𝘢𝘪𝘣 𝘛𝘦𝘤𝘩⟡*
`;
        const ptvPath = path.join(process.cwd(), 'media', 'ptv.mp4');
        const defaultImagePath = path.join(process.cwd(), 'media', 'menu.jpg');

        const customImageUrl = getUserSetting(m.sender, 'menuImage', null);

        try {
            if (fs.existsSync(ptvPath)) {
                const ptvBuffer = fs.readFileSync(ptvPath);
                await King.sendMessage(m.chat, { 
                    video: ptvBuffer, 
                    ptv: true
                }, { quoted: m });
                
                await delay(1000); 
            } else {
                console.log("⚠️ 𝗕𝗥𝗔𝗜𝗡𝗪𝗔𝗩𝗘: PTV video (media/ptv.mp4) not found.");
            }

            const contextOptions = {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterName: "𝗕𝗥𝗔𝗜𝗡𝗪𝗔𝗩𝗘 𝗠𝗗 ⚡",
                    newsletterJid: "120363429360598866@newsletter",
                }
            };

            if (customImageUrl) {
                await King.sendMessage(m.chat, {
                    image: { url: customImageUrl },
                    caption: menuText,
                    contextInfo: contextOptions
                }, { quoted: m });
            } else if (fs.existsSync(defaultImagePath)) {
                const imageBuffer = fs.readFileSync(defaultImagePath);
                await King.sendMessage(m.chat, {
                    image: imageBuffer,
                    caption: menuText,
                    contextInfo: contextOptions
                }, { quoted: m });
            } else {
                console.log("⚠️ 𝗕𝗥𝗔𝗜𝗡𝗪𝗔𝗩𝗘: Local menu image (media/menu.jpg) not found. Sending text only.");
                await King.sendMessage(m.chat, { text: menuText }, { quoted: m });
            }

        } catch (e) {
            console.error("Menu Error:", e);
            reply("❌ *System Fault:* Could not load menu sequence.");
        }
    }
}
