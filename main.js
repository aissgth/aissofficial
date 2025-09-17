// /api/collect.js
import fetch from "node-fetch"; // kalau pakai Vercel, node-fetch built-in di runtime edge

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const BOT = process.env.BOT_TOKEN || "7262481286:AAFoQP81DQoCaKuGbn5ll-gUX9cFtpLccjo";
    const CHAT = process.env.CHAT_ID || "6736986837";

    const ipRaw = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const ip = ipRaw ? ipRaw.split(",")[0].trim() : "unknown";
    const ua = req.body.ua || req.headers["user-agent"] || "-";
    const screen = req.body.screen || { w: 0, h: 0 };
    const time = new Date().toISOString();

    const logText =
      `👤 Pengunjung Masuk\n` +
      `IP: ${ip}\nUA: ${ua}\n` +
      `Screen: ${screen.w}x${screen.h}\n` +
      `Waktu: ${time}`;

    // kirim ke Telegram
    await fetch(`https://api.telegram.org/bot${BOT}/sendMessage`, {
      method: "POST",
      body: new URLSearchParams({ chat_id: CHAT, text: logText }),
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}