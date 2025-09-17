// api/collect.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const BOT = process.env.BOT_TOKEN;
    const CHAT = process.env.CHAT_ID;

    // Ambil IP
    const ipRaw = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const ip = ipRaw ? ipRaw.split(",")[0].trim() : "unknown";

    // Pastikan body ter-parse
    let body = {};
    if (typeof req.body === "string") {
      try {
        body = JSON.parse(req.body);
      } catch {
        body = {};
      }
    } else {
      body = req.body || {};
    }

    const ua = body.ua || req.headers["user-agent"] || "-";
    const screen = body.screen || { w: 0, h: 0 };
    const time = new Date().toISOString();

    const logText =
      `👤 Pengunjung Masuk\n` +
      `IP: ${ip}\nUA: ${ua}\n` +
      `Screen: ${screen.w}x${screen.h}\n` +
      `Waktu: ${time}`;

    // Kirim ke Telegram
    await fetch(`https://api.telegram.org/bot${BOT}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ chat_id: CHAT, text: logText }),
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Error collect:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
