import { NextResponse } from 'next/server';
import clientPromise from '../../lib/mongodb';
import { ObjectId } from 'mongodb';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import fs from 'fs';
import crypto from 'crypto';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('profileImage');
    const userId = formData.get('userId');

    if (!file || !userId) {
      return NextResponse.json({ 
        success: false,
        error: 'File dan User ID diperlukan' 
      }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ 
        success: false,
        error: 'Hanya file gambar yang diperbolehkan' 
      }, { status: 400 });
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ 
        success: false,
        error: 'Ukuran file maksimal 2MB' 
      }, { status: 400 });
    }

    // Read file buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Generate unique filename using crypto.randomUUID() (Node.js built-in)
    const originalName = file.name;
    const fileExt = originalName.split('.').pop().toLowerCase();
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    
    if (!allowedExtensions.includes(fileExt)) {
      return NextResponse.json({ 
        success: false,
        error: 'Format file tidak didukung. Gunakan JPG, PNG, GIF, atau WebP' 
      }, { status: 400 });
    }

    // Use crypto.randomUUID() for unique filename
    const uniqueId = crypto.randomUUID();
    const fileName = `${uniqueId}.${fileExt}`;
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'profiles');
    
    // Create directory if not exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = join(uploadDir, fileName);
    
    // Save file
    await writeFile(filePath, buffer);

    // Generate URL for the image
    const imageUrl = `/uploads/profiles/${fileName}`;

    // Connect to database
    const client = await clientPromise;
    const db = client.db('todolist');

    // First, get old image to delete it
    const user = await db.collection('users').findOne({ 
      _id: new ObjectId(userId) 
    });
    
    if (user?.profileImage) {
      try {
        const oldImagePath = join(process.cwd(), 'public', user.profileImage);
        if (fs.existsSync(oldImagePath)) {
          await unlink(oldImagePath);
        }
      } catch (error) {
        console.error('Failed to delete old image:', error);
        // Continue even if deletion fails
      }
    }

    // Update database with new image
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { 
        $set: { 
          profileImage: imageUrl,
          updatedAt: new Date()
        } 
      }
    );

    if (result.matchedCount === 0) {
      // Clean up uploaded file if user not found
      try {
        if (fs.existsSync(filePath)) {
          await unlink(filePath);
        }
      } catch (cleanupError) {
        console.error('Cleanup error:', cleanupError);
      }
      return NextResponse.json({ 
        success: false,
        error: 'User tidak ditemukan' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      imageUrl,
      message: 'Foto profil berhasil diupload'
    });

  } catch (error) {
    console.error("Upload Profile Error:", error);
    
    return NextResponse.json({ 
      success: false,
      error: 'Terjadi kesalahan saat mengupload foto' 
    }, { status: 500 });
  }
}