import { NextResponse } from 'next/server'
import clientPromise from '../../../lib/mongodb'
import { ObjectId } from 'mongodb'

export async function PUT(request, context) {
  try {
    // Await params karena params adalah Promise di Next.js App Router
    const { params } = context;
    const { id } = await params;
    
    const updateData = await request.json();

    const client = await clientPromise
    const db = client.db('todolist')
    const tasks = db.collection('tasks')
    
    const result = await tasks.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: {
          ...updateData,
          updatedAt: new Date()
        }
      }
    )
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }
    
    return NextResponse.json({
      success: true,
      message: 'Task updated successfully'
    })
    
  } catch (error) {
    console.error('Error updating task:', error)
    return NextResponse.json({ 
      error: 'Failed to update task',
      details: error.message 
    }, { status: 500 })
  }
}

export async function DELETE(request, context) {
  try {
    // Await params karena params adalah Promise di Next.js App Router
    const { params } = context;
    const { id } = await params;

    const client = await clientPromise
    const db = client.db('todolist')
    const tasks = db.collection('tasks')
    
    const result = await tasks.deleteOne({ _id: new ObjectId(id) })
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }
    
    return NextResponse.json({
      success: true,
      message: 'Task deleted successfully'
    })
    
  } catch (error) {
    console.error('Error deleting task:', error)
    return NextResponse.json({ 
      error: 'Failed to delete task',
      details: error.message 
    }, { status: 500 })
  }
}