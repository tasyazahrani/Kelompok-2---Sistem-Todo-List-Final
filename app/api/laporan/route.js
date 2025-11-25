import { NextResponse } from 'next/server';
import clientPromise from '../../lib/mongodb';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    console.log('📊 Laporan API called for user:', userId);

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('todolist');
    const tasksCollection = db.collection('tasks');
    
    // Ambil semua tasks user
    const tasks = await tasksCollection.find({ userId }).toArray();
    
    console.log(`📋 Found ${tasks.length} tasks for user ${userId}`);
    
    // DEBUG: Tampilkan struktur data tasks
    console.log('🔍 All tasks structure:', tasks.map(task => ({
      id: task._id,
      title: task.title,
      subtasks: task.subtasks,
      completedSubtasks: task.completedSubtasks,
      hasSubtasks: !!task.subtasks,
      subtasksLength: task.subtasks ? task.subtasks.length : 0,
      completedSubtasksLength: task.completedSubtasks ? task.completedSubtasks.length : 0
    })));

    // HITUNG STATISTIK UNTUK LAPORAN
    const totalTasks = tasks.length;
    
    // Hitung completed tasks (semua subtasks selesai)
    const completedTasks = tasks.filter(task => {
      // Jika task punya subtasks
      if (task.subtasks && task.subtasks.length > 0) {
        // Pastikan completedSubtasks ada dan panjangnya sama dengan subtasks
        if (task.completedSubtasks && task.completedSubtasks.length === task.subtasks.length) {
          const completedCount = task.completedSubtasks.filter(c => c === true).length;
          return completedCount === task.subtasks.length;
        }
      }
      return false;
    }).length;

    // Hitung tasks in progress (beberapa subtasks selesai)
    const tasksInProgress = tasks.filter(task => {
      if (task.subtasks && task.subtasks.length > 0 && task.completedSubtasks) {
        const completedCount = task.completedSubtasks.filter(c => c === true).length;
        return completedCount > 0 && completedCount < task.subtasks.length;
      }
      return false;
    }).length;

    // Hitung tasks not started
    const tasksNotStarted = tasks.filter(task => {
      if (task.subtasks && task.subtasks.length > 0) {
        if (!task.completedSubtasks || task.completedSubtasks.length === 0) {
          return true;
        }
        const completedCount = task.completedSubtasks.filter(c => c === true).length;
        return completedCount === 0;
      }
      return true;
    }).length;

    // Hitung overdue tasks
    const now = new Date();
    const overdueTasks = tasks.filter(task => {
      if (!task.deadline) return false;
      
      // Cek jika task belum completed
      const isCompleted = task.subtasks && task.completedSubtasks ?
        task.completedSubtasks.filter(c => c === true).length === task.subtasks.length : false;
      
      return !isCompleted && new Date(task.deadline) < now;
    }).length;

    // Hitung progress keseluruhan
    const overallProgress = totalTasks > 0 ? 
      Math.round((completedTasks / totalTasks) * 100) : 0;

    // Hitung milestones (setiap 3 task = 1 milestone)
    const totalMilestones = Math.max(1, Math.ceil(totalTasks / 3));
    const completedMilestones = Math.floor(completedTasks / 3);
    const milestoneProgress = totalMilestones > 0 ? 
      Math.round((completedMilestones / totalMilestones) * 100) : 0;

    // GENERATE TIMELINE DATA
    const timeline = tasks.map(task => {
      let progress = 0;
      let status = 'not-started';
      let icon = '📝';
      
      if (task.subtasks && task.subtasks.length > 0 && task.completedSubtasks) {
        const completedCount = task.completedSubtasks.filter(c => c === true).length;
        progress = Math.round((completedCount / task.subtasks.length) * 100);
        
        if (progress === 100) {
          status = 'completed';
          icon = '✅';
        } else if (progress > 0) {
          status = 'in-progress';
          icon = '⏳';
        }
      }

      return {
        id: task._id.toString(),
        title: task.title || 'Untitled Task',
        description: task.notes || 'Tidak ada deskripsi',
        progress: progress,
        status: status,
        icon: icon,
        deadline: task.deadline,
        priority: task.priority || 'medium'
      };
    }).sort((a, b) => {
      // Urutkan: completed -> in-progress -> not-started
      const statusOrder = { 'completed': 0, 'in-progress': 1, 'not-started': 2 };
      return statusOrder[a.status] - statusOrder[b.status];
    });

    // GENERATE RECENT ACTIVITIES
    const recentActivities = [];
    
    // Activity dari task creation
    tasks.forEach(task => {
      if (task.createdAt) {
        recentActivities.push({
          id: `${task._id.toString()}-created`,
          title: `Membuat tugas "${task.title}"`,
          icon: '📝',
          time: new Date(task.createdAt).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          })
        });
      }
    });

    // Activity dari completed tasks
    tasks.forEach(task => {
      if (task.subtasks && task.subtasks.length > 0 && task.completedSubtasks) {
        const completedCount = task.completedSubtasks.filter(c => c === true).length;
        if (completedCount === task.subtasks.length) {
          recentActivities.push({
            id: `${task._id.toString()}-completed`,
            title: `Menyelesaikan "${task.title}"`,
            icon: '✅',
            time: new Date().toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })
          });
        }
      }
    });

    // Urutkan activities dari yang terbaru dan ambil 5 teratas
    const sortedActivities = recentActivities
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 5);

    // DATA LAPORAN FINAL
    const reportData = {
      overallProgress,
      completedTasks,
      totalTasks,
      milestoneProgress,
      completedMilestones: Math.min(completedMilestones, totalMilestones),
      totalMilestones,
      tasksInProgress,
      tasksNotStarted,
      overdueTasks,
      timeline,
      recentActivities: sortedActivities
    };

    console.log('📈 FINAL REPORT DATA:', reportData);

    return NextResponse.json({
      success: true,
      reportData: reportData
    });

  } catch (error) {
    console.error('❌ Error in laporan API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}