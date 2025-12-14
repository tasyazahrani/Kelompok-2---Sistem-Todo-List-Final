// middleware.js
import { NextResponse } from 'next/server';
import { kirimLog } from './tes-grafana'; // Panggil file langkah 1 tadi

export function middleware(request) {
  // 1. Ambil data request
  const method = request.method;
  const url = request.nextUrl.pathname;
  
  // Ambil userId dari URL jika ada (misal: /api/tasks?userId=123)
  const userId = request.nextUrl.searchParams.get('userId') || 'guest';

  // 2. Lanjutkan proses aplikasi seperti biasa
  const response = NextResponse.next();

  // 3. SETELAH PROSES SELESAI -> KIRIM LOG
  // Logika: "Ada request METHOD ke URL dengan status STATUS oleh USER"
  const pesanLog = `Aktivitas: ${method} ${url} | Status: ${response.status}`;

  // Panggil fungsi dari tes-grafana.js
  kirimLog(pesanLog, {
    method: method,
    route: url,
    status: String(response.status),
    user_id: userId
  });

  return response;
}

// ATURAN: Hanya jalankan log untuk folder /api
export const config = {
  matcher: '/api/:path*',
};