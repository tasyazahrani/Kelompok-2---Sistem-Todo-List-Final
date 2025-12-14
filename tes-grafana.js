// tes-grafana.js
// GANTI DENGAN DATA ASLI DARI .ENV.LOCAL KAMU
const USER = process.env.LOKI_USER || '1423284'; 
const PASS = process.env.GRAFANA_TOKEN; // Pastikan token ada di .env.local
const HOST = process.env.LOKI_HOST || 'https://logs-prod-032.grafana.net';

// Fungsi ini yang akan dipanggil oleh Middleware
export async function kirimLog(pesan, labelData = {}) {
  // Cek token dulu
  if (!PASS) return;

  // 1. Buat Auth Header (Pakai btoa agar aman di Next.js)
  const auth = 'Basic ' + btoa(`${USER}:${PASS}`);

  // 2. Siapkan Label
  const streamLabels = { 
      app: 'todolist-uas', 
      level: 'info',
      ...labelData 
  };

  // 3. Kirim ke Grafana
  try {
    // Gunakan fetch tanpa await (Fire & Forget) supaya aplikasi tidak lemot
    fetch(`${HOST}/loki/api/v1/push`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': auth
      },
      body: JSON.stringify({
        streams: [
          {
            stream: streamLabels,
            values: [
              [String(Date.now() * 1000000), pesan]
            ]
          }
        ]
      })
    }).catch(err => console.log("Gagal lapor Grafana:", err.message));

  } catch (error) {
    console.log("Error System Log:", error);
  }
}