# 🚀 TaskFlow - Todo List System (Kelompok 2)

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge&logo=mongodb)
![Docker](https://img.shields.io/badge/Docker-Container-blue?style=for-the-badge&logo=docker)
![Grafana](https://img.shields.io/badge/Grafana-Loki-orange?style=for-the-badge&logo=grafana)
![Vercel](https://img.shields.io/badge/Deployment-Vercel-000000?style=for-the-badge&logo=vercel)

<p align="center">
  <strong>Sistem Manajemen Tugas Terintegrasi dengan Hybrid Database & Centralized Logging.</strong><br>
  Diajukan untuk memenuhi Tugas Akhir Mata Kuliah Pemrograman Berorientasi Objek / Platform (POPL).
</p>

[🌐 Live Demo](https://kelompok-2-sistem-todo-list-final-hlv3-g7mb9y6lx.vercel.app) • [📂 Repository](https://github.com/tasyazahrani/Kelompok-2---Sistem-Todo-List-Final) • [🐞 Report Bug](https://github.com/tasyazahrani/Kelompok-2---Sistem-Todo-List-Final/issues)

</div>

---

## 📖 Tentang Proyek

**Sistem Todo List Final** adalah aplikasi web modern yang dirancang untuk produktivitas pengguna dengan fokus pada **keandalan teknis** dan **skalabilitas**. 

Berbeda dengan aplikasi Todo biasa, sistem ini menerapkan arsitektur **Hybrid Database** yang unik—menggabungkan fleksibilitas *Mongoose ORM* dengan performa *Native MongoDB Driver* dalam satu ekosistem. Selain itu, aplikasi ini dilengkapi dengan sistem pemantauan (observability) tingkat lanjut menggunakan **Grafana Loki** untuk pelacakan log aktivitas secara real-time.

### ✨ Fitur Unggulan

#### 🛡️ Keamanan & Autentikasi
* **Secure Auth:** Sistem Login/Register terenkripsi menggunakan `bcrypt` dan session management.
* **Security Patch:** Menggunakan Next.js v16.x terbaru yang telah dipatch dari kerentanan keamanan (CVE-2025-66478).

#### ⚙️ Keunggulan Teknis (DevOps & Backend)
* **Hybrid Database Connection:** Implementasi *Dual-Layer Connection* (Native Driver untuk Auth & Mongoose untuk Data Transaksional) untuk stabilitas maksimal.
* **Centralized Logging:** Integrasi penuh dengan **Grafana Cloud**. Mencatat setiap *request*, *error*, dan aktivitas pengguna untuk debugging yang efisien.
* **Containerization:** Mendukung deployment berbasis **Docker** untuk konsistensi lingkungan pengembangan.
* **CI/CD Pipeline:** Deployment otomatis ke **Vercel** setiap kali ada pembaruan kode (Continuous Deployment).

---

## 🛠️ Tech Stack

Aplikasi ini dibangun menggunakan teknologi terkini:

| Kategori | Teknologi | Deskripsi |
| :--- | :--- | :--- |
| **Frontend/Backend** | ![Next.js](https://img.shields.io/badge/-Next.js-black?logo=next.js) | Framework React Fullstack (App Router). |
| **Database** | ![MongoDB](https://img.shields.io/badge/-MongoDB-green?logo=mongodb) | Database NoSQL berbasis Cloud (Atlas). |
| **Logging** | ![Grafana](https://img.shields.io/badge/-Grafana%20Loki-orange?logo=grafana) | Monitoring dan agregasi log terpusat. |
| **Container** | ![Docker](https://img.shields.io/badge/-Docker-blue?logo=docker) | Standarisasi environment aplikasi. |
| **Deployment** | ![Vercel](https://img.shields.io/badge/-Vercel-black?logo=vercel) | Platform hosting serverless global. |

---

## 🚀 Memulai (Getting Started)

Ikuti langkah-langkah berikut untuk menjalankan proyek ini di komputer lokal Anda.

### Prasyarat
* Node.js (v18 atau lebih baru)
* Docker Desktop (Opsional, jika ingin menggunakan Docker)
* Akun MongoDB Atlas & Grafana Cloud

### 1. Clone Repository
```bash
git clone [https://github.com/tasyazahrani/Kelompok-2---Sistem-Todo-List-Final.git](https://github.com/tasyazahrani/Kelompok-2---Sistem-Todo-List-Final.git)
cd Kelompok-2---Sistem-Todo-List-Final
````

### 2\. Install Dependencies

```bash
npm install
```

### 3\. Konfigurasi Environment (.env)

Buat file `.env` di direktori utama dan isi dengan kredensial Anda:

```env
# Database Configuration
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/todo_db

# Grafana Loki Configuration (Untuk Logging)
GRAFANA_TOKEN=glc_eyJvIjoi.....
LOKI_USER=123456
LOKI_HOST=[https://logs-prod-us-central1.grafana.net](https://logs-prod-us-central1.grafana.net)

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4\. Jalankan Aplikasi

```bash
npm run dev
```

Akses aplikasi di: `http://localhost:3000`

-----

## 🐳 Menjalankan dengan Docker

Kami menyediakan dukungan Docker untuk isolasi yang lebih baik.

**Build Image:**

```bash
docker build -t todo-app-klp2 .
```

**Run Container:**

```bash
docker run -p 3000:3000 --env-file .env todo-app-klp2
```

-----

## 👥 Tim Pengembang (Kelompok 2)

| Nama | Peran & Kontribusi Utama | GitHub |
| :--- | :--- | :--- |
| **Tasya Zahrani** | **Project Lead** <br> • Repository Owner <br> • Frontend Architecture | [@tasyazahrani](https://www.google.com/search?q=https://github.com/tasyazahrani) |
| **Dea Zasqia P. Malau** | **DevOps & Backend Engineer** <br> • CI/CD Vercel Deployment <br> • Docker Implementation <br> • Grafana Logging Integration <br> • Hybrid DB Logic | [@deazasqiamalau](https://www.google.com/search?q=https://github.com/deazasqiamalau) |
-----

## 📝 Log Pembaruan Terakhir

  * **v1.2.0 (Latest):** Implementasi *Hybrid Database Module* untuk memperbaiki konflik koneksi Mongoose.
  * **v1.1.5:** Patch keamanan update Next.js (Fix Vulnerability).
  * **v1.1.0:** Integrasi penuh Grafana Loki Logger.
  * **v1.0.0:** Deployment Initial ke Vercel Production.

-----

\<div align="center"\>
\<small\>Copyright © 2024 Kelompok 2 - UAS POPL. Dibuat dengan ❤️ dan kopi.\</small\>
\</div\>

````