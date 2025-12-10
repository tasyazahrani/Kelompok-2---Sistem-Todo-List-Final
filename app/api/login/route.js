import { NextResponse } from 'next/server'
import clientPromise from '../../lib/mongodb' // Pastikan path ini sesuai
import bcrypt from 'bcryptjs'
import logger from '../../lib/logger' // <--- Kita panggil logger yang baru dibuat

export async function POST(request) {
  try {
    const { mobile, password } = await request.json()
    
    // [LOG] Mencatat ada yang mencoba login
    logger.info(`Percobaan login`, { mobile, action: 'auth_attempt' });

    if (!mobile || !password) {
      logger.warn('Login gagal: Data tidak lengkap', { mobile });
      return NextResponse.json({ error: 'No HP dan password harus diisi' }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db('todolist')
    const user = await db.collection('users').findOne({ mobile })
    
    if (!user) {
      // [LOG] Mencatat login gagal karena user tidak ada
      logger.warn(`Login gagal: User tidak ditemukan`, { mobile });
      return NextResponse.json({ error: 'No HP atau password salah' }, { status: 401 })
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password)
    
    if (!isPasswordValid) {
      // [LOG] PENTING: Mencatat password salah (bisa jadi indikasi peretasan)
      logger.warn(`Login gagal: Password salah`, { mobile });
      return NextResponse.json({ error: 'No HP atau password salah' }, { status: 401 })
    }
    
    // [LOG] Login Berhasil
    logger.info(`Login Berhasil: ${user.name}`, { userId: user._id, action: 'login_success' });

    const { password: _, ...userWithoutPassword } = user
    return NextResponse.json({ 
        message: 'Login berhasil', 
        user: userWithoutPassword 
    }, { status: 200 })
    
  } catch (error) {
    // [LOG] Error sistem (Database mati, dll)
    logger.error('Error Sistem Login', { error: error.message });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}