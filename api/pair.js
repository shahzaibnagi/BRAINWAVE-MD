const BOT_BASE_URL = process.env.BOT_BASE_URL;
const ALLOWED_ORIGIN =
  process.env.ALLOWED_ORIGIN || "https://brainwave-md-pairing-site.vercel.app";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", "GET");

  const number = String(req.query.number || "").replace(/\D/g, "").slice(0, 15);

  if (!number) {
    return res.status(400).json({ success: false, error: "Phone number is required." });
  }

  if (!BOT_BASE_URL) {
    console.error("BOT_BASE_URL is not configured");
    return res.status(500).json({
      success: false,
      error: "Pairing service is not configured.",
    });
  }

  try {
    const response = await fetch(`${BOT_BASE_URL}/api/getcode?number=${number}`);

    if (!response.ok) {
      throw new Error(`upstream returned ${response.status}`);
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("pair bridge:", error.message);
    return res.status(500).json({
      success: false,
      error: "Pairing server is unreachable. Try again later.",
    });
  }
}
