export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    const number = req.query.number;
    
    if (!number) {
        return res.status(400).json({ success: false, error: "Phone number is required." });
    }

    try {
        const botUrl = `http://BOT_BASE_URL/api/getcode?number=${number}`;
        
        console.log(`Fetching code for: ${number} from VPS...`);
        
        const response = await fetch(botUrl);
        
        if (!response.ok) {
            throw new Error(`VPS returned status: ${response.status}`);
        }
        
        const data = await response.json();
        
        res.status(200).json(data);

    } catch (error) {
        console.error("Vercel API Bridge Error:", error.message);
        res.status(500).json({ 
            success: false, 
            error: "Brainwave Server is currently unreachable or busy. Try again later." 
        });
    }
}
