# 1. Pilih "Base Image" (Ibarat OS yang sudah ada Node.js-nya)
FROM node:18-alpine

# 2. Bikin folder kerja di dalam container
WORKDIR /app

# 3. Copy file package.json dulu (biar installnya efisien)
COPY package*.json ./

# 4. Install library yang dibutuhkan (winston, loki, dotenv, dll)
RUN npm install

# 5. Copy sisa semua kodingan kamu ke dalam container
COPY . .

# 6. Perintah untuk menjalankan aplikasi saat container nyala
# Pastikan nama filenya BENAR. Kalau nama file utamamu 'tes-grafana.js', pakai ini:
CMD ["node", "tes-grafana.js"]