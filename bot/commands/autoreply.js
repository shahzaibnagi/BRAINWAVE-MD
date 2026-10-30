const fs = require('fs');
const path = require('path');
const dbPath = './db.json';

module.exports = {
    name: 'autoreply',
    run: async (King, m, { args }) => { 
        
        const senderNum = m.sender.split('@')[0];
        const ownerNum = global.owner ? String(global.owner) : '';
        const sudoNums = global.sudo ? String(global.sudo) : '';
        const isOwner = senderNum === ownerNum || sudoNums.includes(senderNum) || m.fromMe;

        if (!isOwner) return m.reply("❌ This command is restricted to the Owner!");

        const botNumber = King.user.id ? King.user.id.split(':')[0].split('@')[0] : 'default_bot';

        let db = {};
        try {
            db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
        } catch (err) {
            db = {}; 
        }
        
        if (!db.autoreply) db.autoreply = {};
        
        if (!db.autoreply[botNumber]) {
            db.autoreply[botNumber] = { 
                status: false, 
                msg: "🤖 *Auto-Reply:*\nI am currently offline and will get back to you shortly." 
            };
        }

        const action = args[0]?.toLowerCase();

        if (action === 'on') {
            db.autoreply[botNumber].status = true;
            fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
            return m.reply("✅ Auto-reply is now *ON* for this bot instance.\n(It applies to private chats, ignoring groups).");
            
        } else if (action === 'off') {
            db.autoreply[botNumber].status = false;
            fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
            return m.reply("❌ Auto-reply is now *OFF* for this bot instance.");
            
        } else if (action === 'set') {
            const customMsg = args.slice(1).join(" ");
            if (!customMsg) return m.reply("⚠️ You must provide a message!\n*Example:* .autoreply set I am currently busy.");
            
            db.autoreply[botNumber].msg = customMsg;
            fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
            return m.reply(`✅ Auto-reply message set for this bot:\n\n"${customMsg}"`);
            
        } else {
            return m.reply("⚙️ *Bot Auto-Reply Menu:*\n\n1. `.autoreply on` - Activate for all private chats\n2. `.autoreply off` - Deactivate\n3. `.autoreply set <text>` - Set custom message");
        }
    }
};
