import { NextResponse } from 'next/server'
import clientPromise from '../../lib/mongodb'  // Path yang benar

export async function GET() {
  try {
    console.log('Testing MongoDB connection...')
    
    const client = await clientPromise
    console.log('MongoDB client connected')
    
    const db = client.db('todolist')
    console.log('Database accessed')
    
    // Test dengan ping
    const result = await db.command({ ping: 1 })
    console.log('Ping result:', result)
    
    return NextResponse.json({
      success: true,
      message: 'MongoDB connected successfully!',
      ping: result
    })
    
  } catch (error) {
    console.error('MongoDB connection failed:', error)
    
    return NextResponse.json({
      success: false,
      error: 'MongoDB connection failed',
      message: error.message,
      code: error.code
    }, { status: 500 })
  }
}