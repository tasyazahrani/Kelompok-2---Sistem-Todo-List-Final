import { NextResponse } from 'next/server';
import clientPromise from '../../lib/mongodb'; // Ini akan berhasil jika struktur folder di Langkah 1 benar
import { ObjectId } from 'mongodb';

// GET: Ambil Data User & Settings saat halaman dibuka
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'UserId required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('todolist'); // Pastikan nama DB sesuai
    
    // Cari user
    const user = await db.collection('users').findOne(
        { _id: new ObjectId(userId) },
        { projection: { password: 0 } } 
    );

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        settings: user.settings || {} 
      }
    });

  } catch (error) {
    console.error("API Settings Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST: Simpan Perubahan Settings & Profil
export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, name, email, settings } = body;

    if (!userId) {
      return NextResponse.json({ error: 'UserId required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('todolist');

    // Update data user
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { 
        $set: {
          name: name,
          email: email, // Hati-hati mengubah email jika digunakan untuk login
          settings: settings,
          updatedAt: new Date()
        } 
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Pengaturan berhasil disimpan'
    });

  } catch (error) {
    console.error("API Update Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}