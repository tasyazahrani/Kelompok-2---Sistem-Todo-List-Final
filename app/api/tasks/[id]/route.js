import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '../../../lib/mongodb';

// Handler untuk UPDATE task
export async function PUT(request, { params }) {
  try {
    // Await params karena Next.js 13+ menggunakan async params
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Task ID required' },
        { status: 400 }
      );
    }

    const updateData = await request.json();
    
    const client = await clientPromise;
    const db = client.db('todolist');
    
    // Siapkan data yang akan diupdate
    const dataToUpdate = {
      ...updateData,
      updatedAt: new Date()
    };
    
    // Hapus _id jika ada (tidak boleh diupdate)
    delete dataToUpdate._id;
    
    // Update task di database
    const result = await db.collection('tasks').updateOne(
      { _id: new ObjectId(id) },
      { $set: dataToUpdate }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Task tidak ditemukan' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Task berhasil diupdate',
      modifiedCount: result.modifiedCount
    });
    
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// Handler untuk DELETE task
export async function DELETE(request, { params }) {
  try {
    // Await params karena Next.js 13+ menggunakan async params
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Task ID required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('todolist');
    
    // Hapus task dari database
    const result = await db.collection('tasks').deleteOne(
      { _id: new ObjectId(id) }
    );
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Task tidak ditemukan' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Task berhasil dihapus' 
    });
    
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}