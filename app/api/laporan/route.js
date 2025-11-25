import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb'; // Pastikan path ini sesuai dengan struktur foldermu
import { ObjectId } from 'mongodb';

export async function GET(request) {
  try {
    // 1. Ambil userId dari query parameters URL (contoh: /api/laporan?userId=xxx)
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'UserId is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('todolist');
    const tasksCollection = db.collection('tasks');

    // 2. Ambil semua tugas berdasarkan userId
    // Kita mengambil semua untuk dihitung statistiknya di server
    const tasks = await tasksCollection.find({ userId: userId }).toArray();

    // 3. Hitung Statistik (Logic Backend)
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'completed').length;
    const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
    
    // Hitung 'Pending' (Status pending atau belum ada status)
    const pendingTasks = tasks.filter(task => !task.status || task.status === 'pending').length;

    // Hitung 'Overdue' (Terlambat)
    // Logika: Belum selesai DAN deadline ada DAN deadline < waktu sekarang
    const now = new Date();
    const overdueTasks = tasks.filter(task => {
      const isNotDone = task.status !== 'completed';
      const hasDeadline = task.taskDeadline; // Pastikan field ini sesuai dengan saat save (taskDeadline)
      
      if (isNotDone && hasDeadline) {
        return new Date(task.taskDeadline) < now;
      }
      return false;
    }).length;

    // Hitung Persentase Progress
    const progressPercentage = totalTasks > 0 
      ? Math.round((completedTasks / totalTasks) * 100) 
      : 0;

    // 4. Generate "Aktivitas Terbaru"
    // Karena kita mungkin belum punya tabel 'log_activity' khusus,
    // kita bisa mengambil 5 tugas yang paling baru di-update/dibuat.
    const recentActivity = tasks
      .sort((a, b) => {
        const dateA = new Date(a.updatedAt || a.createdAt || 0);
        const dateB = new Date(b.updatedAt || b.createdAt || 0);
        return dateB - dateA; // Urutkan dari yang terbaru (Descending)
      })
      .slice(0, 5) // Ambil 5 teratas
      .map(task => ({
        id: task._id,
        title: task.title || task.taskName, // Sesuaikan dengan nama field di DB
        status: task.status || 'pending',
        time: task.updatedAt || task.createdAt,
        type: task.status === 'completed' ? 'completion' : 'update'
      }));

    // 5. Kirim Response JSON
    return NextResponse.json({
      success: true,
      data: {
        stats: {
          total: totalTasks,
          completed: completedTasks,
          inProgress: inProgressTasks,
          pending: pendingTasks,
          overdue: overdueTasks,
          percentage: progressPercentage
        },
        recentActivity: recentActivity,
        // Jika nanti mau nambah logic milestone, bisa taruh sini
        milestones: {
          achieved: Math.floor(completedTasks / 5), // Contoh logika dummy: tiap 5 tugas = 1 milestone
          total: 5
        }
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching report data:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}