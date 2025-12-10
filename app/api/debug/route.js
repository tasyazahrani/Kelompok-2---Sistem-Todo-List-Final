import { NextResponse } from 'next/server';
import clientPromise from '../../lib/mongodb';
import logger from '../../lib/logger'; // IMPORT LOGGER

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    // Ganti console.log biasa dengan logger info
    // console.log('📊 Laporan API called for user:', userId); -> HAPUS
    logger.info(`Fetching report for user: ${userId}`, { action: 'fetch_report' });

    if (!userId) {
      logger.warn('Fetch report failed: Missing UserID');
      return NextResponse.json({ success: false, error: 'User ID required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('todolist');
    const tasks = await db.collection('tasks').find({ userId }).toArray();
    
    // Logging statistik singkat (Bagus untuk debug performa)
    logger.info(`Report generated: ${tasks.length} tasks found`, { 
        userId, 
        taskCount: tasks.length 
    });

    // ... (KODE LOGIKA HITUNGAN BIARKAN SAMA) ...
    // ... (HITUNG overdueTasks, completedTasks, dll) ...

    const reportData = {
       // ... data laporan ...
    };

    return NextResponse.json({ success: true, reportData });

  } catch (error) {
    // Tangkap error detail agar muncul di Grafana
    logger.error('Report generation failed', { 
        userId: searchParams?.get('userId') || 'unknown',
        errorMessage: error.message 
    });
    
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}