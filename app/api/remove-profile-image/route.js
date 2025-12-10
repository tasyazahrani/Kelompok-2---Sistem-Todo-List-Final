import { NextResponse } from 'next/server';
import clientPromise from '../../lib/mongodb';
import { ObjectId } from 'mongodb';
import { unlink } from 'fs/promises';
import { join } from 'path';
import fs from 'fs';

export async function POST(request) {
  try {
    const { userId, imageUrl } = await request.json();

    if (!userId || !imageUrl) {
      return NextResponse.json({ 
        success: false,
        error: 'Data tidak lengkap' 
      }, { status: 400 });
    }

    // Connect to database first
    const client = await clientPromise;
    const db = client.db('todolist');

    // Verify user exists and owns this image
    const user = await db.collection('users').findOne({ 
      _id: new ObjectId(userId),
      profileImage: imageUrl 
    });

    if (!user) {
      return NextResponse.json({ 
        success: false,
        error: 'User atau gambar tidak ditemukan' 
      }, { status: 404 });
    }

    // Delete file from server
    try {
      const filePath = join(process.cwd(), 'public', imageUrl);
      if (fs.existsSync(filePath)) {
        await unlink(filePath);
      }
    } catch (error) {
      console.error('Failed to delete file:', error);
      // Continue even if file deletion fails
    }

    // Remove image reference from database
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { 
        $set: { 
          profileImage: '',
          updatedAt: new Date()
        } 
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ 
        success: false,
        error: 'Gagal memperbarui database' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Foto profil berhasil dihapus' 
    });

  } catch (error) {
    console.error("Remove Profile Image Error:", error);
    return NextResponse.json({ 
      success: false,
      error: 'Internal Server Error' 
    }, { status: 500 });
  }
}