// tes-grafana.js
// GANTI DENGAN DATA ASLI DARI .ENV.LOCAL KAMU
const USER = '1423284'; // Isi LOKI_USER
require('dotenv').config();
const PASS = process.env.GRAFANA_TOKEN;
const HOST = 'https://logs-prod-032.grafana.net'; // Isi LOKI_HOST

console.log("DEBUG CHECK:");
console.log("User ID:", USER);
console.log("Token terbaca:", PASS ? "ADA (Panjang: " + PASS.length + ")" : "KOSONG/UNDEFINED");

const auth = Buffer.from(`${USER}:${PASS}`).toString('base64');

async function kirimLog() {
  console.log("📨 Sedang mencoba kirim pesan ke Grafana...");
  
  try {
    const response = await fetch(`${HOST}/loki/api/v1/push`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`
      },
      body: JSON.stringify({
        streams: [
          {
            stream: { app: 'todolist-uas', level: 'info' },
            values: [
              [String(Date.now() * 1000000), "TES MANUAL DARI SCRIPT NODE JS!"]
            ]
          }
        ]
      })
    });

    if (response.status === 204) {
      console.log("✅ SUKSES! Pesan terkirim. Cek Grafana sekarang.");
    } else {
      console.log("❌ GAGAL! Status:", response.status);
      console.log("Pesan Error:", await response.text());
    }
  } catch (error) {
    console.log("🔥 ERROR KONEKSI:", error);
  }
}

kirimLog();