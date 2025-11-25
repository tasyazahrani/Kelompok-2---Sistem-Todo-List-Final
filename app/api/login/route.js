import { NextResponse } from 'next/server'
import clientPromise from '../../lib/mongodb'  // Path yang benar
import bcrypt from 'bcryptjs'

export async function POST(request) {
  try {
    const { mobile, password } = await request.json()
    
    // Validasi input
    if (!mobile || !password) {
      return NextResponse.json(
        { error: 'Mobile and password are required' },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db('todolist')
    const users = db.collection('users')
    
    // Cari user berdasarkan mobile
    const user = await users.findOne({ mobile })
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid mobile number or password' },
        { status: 401 }
      )
    }
    
    // Verifikasi password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid mobile number or password' },
        { status: 401 }
      )
    }
    
    // Hapus password dari response
    const { password: _, ...userWithoutPassword } = user
    
    return NextResponse.json(
      { 
        message: 'Login successful',
        user: userWithoutPassword
      },
      { status: 200 }
    )
    
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}