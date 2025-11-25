import { NextResponse } from 'next/server'
import clientPromise from '../../lib/mongodb'  // Path yang benar
import bcrypt from 'bcryptjs'

export async function POST(request) {
  try {
    const { name, email, mobile, password } = await request.json()
    
    // Validasi input
    if (!name || !email || !mobile || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db('todolist')
    const users = db.collection('users')
    
    // Cek duplikasi email atau mobile
    const existingUser = await users.findOne({ 
      $or: [{ email }, { mobile }] 
    })
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email or mobile number already registered' },
        { status: 400 }
      )
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)
    
    // Insert user baru
    const result = await users.insertOne({
      name,
      email,
      mobile,
      password: hashedPassword,
      registeredAt: new Date(),
      updatedAt: new Date()
    })
    
    return NextResponse.json(
      { 
        message: 'User registered successfully', 
        userId: result.insertedId 
      },
      { status: 201 }
    )
    
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}