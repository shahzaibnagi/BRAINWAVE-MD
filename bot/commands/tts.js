const googleTTS = require('google-tts-api');

module.exports = {
    name: 'tts',
    run: async (King, m, { args, prefix, command, reply }) => {
        const sendReply = reply || (async (text) => await King.sendMessage(m.chat, { text }, { quoted: m }));

        if (!args || args.length === 0) {
            return sendReply(`⚠️ *Syntax Error:*\n_Provide text for speech synthesis._\n_Example:_ \`.tts Initiating Brainwave Engine\``);
        }

        let texttts = args.join(" ");

        try {
            const ttsUrl = googleTTS.getAudioUrl(texttts, {
                lang: "en",
                slow: false,
                host: "https://translate.google.com",
            });

            await King.sendMessage(m.chat, {
                audio: { url: ttsUrl },
                mimetype: "audio/mpeg",
                fileName: `Brainwave_Voice.mp3`,
                ptt: false
            }, { quoted: m });

        } catch (e) {
            console.error("TTS Error:", e);
            sendReply("❌ *System Fault:* Voice synthesis sequence failed.");
        }
    }
}
