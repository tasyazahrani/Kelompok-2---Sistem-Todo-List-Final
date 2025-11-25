import { NextResponse } from 'next/server'
import clientPromise from '../../lib/mongodb'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db('todolist')
    const tasks = db.collection('tasks')
    
    const userTasks = await tasks.find({ userId }).sort({ createdAt: -1 }).toArray()
    
    return NextResponse.json({
      success: true,
      tasks: userTasks
    })
    
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch tasks',
      details: error.message 
    }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const taskData = await request.json()
    const { userId, title, priority, deadline, notes, subtasks } = taskData
    
    if (!userId || !title) {
      return NextResponse.json({ error: 'User ID and title required' }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db('todolist')
    const tasks = db.collection('tasks')
    
    const completedSubtasks = subtasks.map(() => false)
    
    const newTask = {
      userId,
      title,
      priority: priority || 'medium',
      deadline: deadline || null,
      notes: notes || '',
      subtasks: subtasks || [],
      completedSubtasks,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const result = await tasks.insertOne(newTask)
    
    return NextResponse.json({
      success: true,
      message: 'Task created successfully',
      taskId: result.insertedId,
      task: { ...newTask, _id: result.insertedId }
    }, { status: 201 })
    
  } catch (error) {
    console.error('Error creating task:', error)
    return NextResponse.json({ 
      error: 'Failed to create task',
      details: error.message 
    }, { status: 500 })
  }
}