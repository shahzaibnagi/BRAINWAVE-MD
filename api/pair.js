export default async function handler(req, res) {
    const number = req.query.number;
    
    if (!number) {
        return res.status(400).json({ error: "Number is required" });
    }

    try {
        // Vercel chupke se aapke bot server se baat karega
        const botUrl = `http://merlinclan.duckdns.org:25588/pair-web?number=${number}`;
        const response = await fetch(botUrl);
        const data = await response.json();
        
        // Vercel bot ka code utha kar user ko bhej dega
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Bot Engine Unreachable" });
    }
}
