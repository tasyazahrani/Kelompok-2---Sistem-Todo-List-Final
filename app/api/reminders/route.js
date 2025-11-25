import { NextResponse } from 'next/server';
import clientPromise from '../../lib/mongodb'; 
import { ObjectId } from 'mongodb';

// GET: Ambil Reminder Manual + Tugas Ber-Deadline
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) return NextResponse.json({ error: 'UserId required' }, { status: 400 });

    const client = await clientPromise;
    const db = client.db('todolist');
    
    // 1. Ambil Reminder Manual (yang dibuat di menu Pengingat)
    const manualReminders = await db.collection('reminders')
      .find({ userId: userId })
      .toArray();

    // 2. Ambil Tugas dari menu Tasks (Hanya yang punya deadline & belum selesai)
    const tasksWithDeadline = await db.collection('tasks')
      .find({ 
        userId: userId, 
        deadline: { $ne: null, $ne: "" }, // Deadline tidak kosong
        status: { $ne: "completed" }      // Tugas belum selesai
      })
      .toArray();

    // 3. Ubah format Tugas agar bisa dibaca oleh Alarm
    const taskReminders = tasksWithDeadline.map(task => ({
        _id: task._id,
        title: `📝 TUGAS: ${task.title}`, // Kasih label biar tahu ini tugas
        datetime: task.deadline,
        isTask: true, // Penanda
        isTriggered: false // Default agar alarm bisa bunyi
    }));

    // 4. Gabungkan keduanya
    const allReminders = [...manualReminders, ...taskReminders].sort((a, b) => {
        return new Date(a.datetime) - new Date(b.datetime);
    });

    return NextResponse.json({ success: true, reminders: allReminders });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Simpan Reminder Manual (Tetap diperlukan)
export async function POST(request) {
  try {
    const { userId, title, datetime } = await request.json();
    if (!userId || !title || !datetime) return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 });
    
    const client = await clientPromise;
    const db = client.db('todolist');
    
    const newReminder = { 
        userId, title, datetime: new Date(datetime), isTriggered: false, createdAt: new Date() 
    };
    
    const result = await db.collection('reminders').insertOne(newReminder);
    return NextResponse.json({ success: true, reminder: { ...newReminder, _id: result.insertedId } });
  } catch (error) { return NextResponse.json({ error: error.message }, { status: 500 }); }
}

// DELETE: Hapus Reminder Manual
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const client = await clientPromise;
    const db = client.db('todolist');
    
    // Kita hanya menghapus di tabel reminders. 
    // Jika user mau hapus tugas, harus di menu tugas.
    await db.collection('reminders').deleteOne({ _id: new ObjectId(id) });
    
    return NextResponse.json({ success: true });
  } catch (error) { return NextResponse.json({ error: error.message }, { status: 500 }); }
}