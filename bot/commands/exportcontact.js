const fs = require('fs');

module.exports = {
    name: 'exportcontacts',
    aliases: ['getvcf', 'savecontacts', 'backupcontacts'],
    run: async (King, m, { isCreator, reply }) => {
        try {
            if (!isCreator) return reply("⚠️ Access Denied. Only the Owner can export contacts.");

            if (!King.store || !King.store.contacts) {
                return reply("❌ Bot ka Memory Store initialize nahi hua. Kripya main file mein store.bind() check karein.");
            }

            reply("🔄 Contacts fetch ho rahe hain. VCF file ban rahi hai, thora wait karein...");

            let vcfData = '';
            let count = 0;
            
            const contacts = Object.values(King.store.contacts);

            for (const contact of contacts) {
                if (contact.id && contact.id.endsWith('@s.whatsapp.net')) {
                    const number = contact.id.split('@')[0];
                    const name = contact.name || contact.notify || contact.verifiedName || `Medline Contact ${number}`;
                    
                    vcfData += `BEGIN:VCARD\n`;
                    vcfData += `VERSION:3.0\n`;
                    vcfData += `FN:${name}\n`;
                    vcfData += `TEL;type=CELL;type=VOICE;waid=${number}:+${number}\n`;
                    vcfData += `END:VCARD\n`;
                    
                    count++;
                }
            }

            if (count === 0) {
                return reply("❌ Koi contacts fetch nahi ho sake. Shayad bot ne contacts sync nahi kiye.");
            }

            const fileName = `Medline_Contacts_${count}.vcf`;
            fs.writeFileSync(fileName, vcfData);

            await King.sendMessage(m.chat, {
                document: fs.readFileSync(fileName),
                mimetype: 'text/vcard',
                fileName: fileName,
                caption: `✅ Successfully ${count} contacts ki VCF file generate ho gayi hai!`
            }, { quoted: m });

            fs.unlinkSync(fileName);

        } catch (error) {
            console.error("VCF Command Error:", error);
            reply(`❌ Error aagaya: ${error.message}`);
        }
    }
};
