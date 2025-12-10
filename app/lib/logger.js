import winston from 'winston';

// Setup Winston Biasa (Terminal Only)
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});

// --- FUNGSI PENGIRIM KE GRAFANA (DENGAN DEBUG) ---
const pushToGrafana = async (level, message, meta) => {
  const host = process.env.LOKI_HOST;
  const user = process.env.LOKI_USER;
  const password = process.env.LOKI_PASSWORD;

  // 1. CEK KREDENSIAL
  if (!host || !user || !password) {
    console.log("❌ DEBUG: File .env.local TIDAK TERBACA! Variabel kosong.");
    return;
  }

  // 2. SIAPKAN DATA
  const auth = Buffer.from(`${user}:${password}`).toString('base64');
  const payload = {
    streams: [{
      stream: { app: 'todolist-uas', level: level },
      values: [
        [String(Date.now() * 1000000), JSON.stringify({ message, ...meta })]
      ]
    }]
  };

  try {
    // 3. COBA KIRIM
    const response = await fetch(`${host}/loki/api/v1/push`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`
      },
      body: JSON.stringify(payload)
    });

    // 4. LAPORKAN HASILNYA DI TERMINAL
    if (response.status === 204) {
      console.log(`✅ DEBUG: Terkirim ke Grafana! (Status 204)`);
    } else {
      const text = await response.text();
      console.log(`🔥 DEBUG: Ditolak Grafana! Status: ${response.status}`);
      console.log(`   Pesan: ${text}`);
    }

  } catch (err) {
    console.error('⚠️ DEBUG: Error Jaringan/Fetch:', err);
  }
};

// Override Logger
const originalInfo = logger.info.bind(logger);
const originalWarn = logger.warn.bind(logger);
const originalError = logger.error.bind(logger);

logger.info = (msg, meta) => { originalInfo(msg, meta); pushToGrafana('info', msg, meta); };
logger.warn = (msg, meta) => { originalWarn(msg, meta); pushToGrafana('warn', msg, meta); };
logger.error = (msg, meta) => { originalError(msg, meta); pushToGrafana('error', msg, meta); };

export default logger;