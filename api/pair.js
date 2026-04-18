export default async function handler(req, res) {
    // ⚡ CORS Headers (Taake Vercel frontend asani se data receive kar sake)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    const number = req.query.number;
    
    // Check agar user ne number nahi dala
    if (!number) {
        return res.status(400).json({ success: false, error: "Phone number is required." });
    }

    try {
        // ⚡ Aapke VPS Bot ka Live Link (Jo aapne verify kiya hai)
        const botUrl = `http://demmy.saturohost.xyz:25565/api/getcode?number=${number}`;
        
        console.log(`Fetching code for: ${number} from VPS...`);
        
        // Vercel chupke se VPS se data mangwa raha hai
        const response = await fetch(botUrl);
        
        // Agar VPS se response theek na aaye
        if (!response.ok) {
            throw new Error(`VPS returned status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // VPS ka data seedha frontend ko bhej diya
        res.status(200).json(data);

    } catch (error) {
        console.error("Vercel API Bridge Error:", error.message);
        // Agar VPS off ho ya port block ho
        res.status(500).json({ 
            success: false, 
            error: "Brainwave Server is currently unreachable or busy. Try again later." 
        });
    }
}
