import { NextResponse } from 'next/server';
import clientPromise from '../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ 
        success: false,
        error: 'UserId required' 
      }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('todolist');
    
    const user = await db.collection('users').findOne(
      { _id: new ObjectId(userId) },
      { projection: { password: 0 } }
    );

    if (!user) {
      return NextResponse.json({ 
        success: false,
        error: 'User not found' 
      }, { status: 404 });
    }

    const userData = {
      _id: user._id,
      id: user._id.toString(),
      name: user.name || '',
      email: user.email || '',
      profileImage: user.profileImage || '',
      settings: user.settings || {
        language: 'id',
        fontSize: 'medium',
        toggles: {
          pushNotifications: true,
          emailNotifications: false,
          autoSave: true,
          showCompletedTasks: true,
          enableSounds: false,
          keyboardShortcuts: true
        }
      }
    };

    return NextResponse.json({
      success: true,
      user: userData
    });

  } catch (error) {
    console.error("API Settings GET Error:", error);
    return NextResponse.json({ 
      success: false,
      error: 'Internal Server Error' 
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, name, email, profileImage, settings } = body;

    if (!userId) {
      return NextResponse.json({ 
        success: false,
        error: 'UserId required' 
      }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('todolist');

    const updateData = {
      name: name || '',
      email: email || '',
      updatedAt: new Date()
    };

    if (profileImage !== undefined) {
      updateData.profileImage = profileImage;
    }

    if (settings) {
      updateData.settings = {
        language: settings.language || 'id',
        fontSize: settings.fontSize || 'medium',
        toggles: {
          pushNotifications: settings.toggles?.pushNotifications !== undefined 
            ? settings.toggles.pushNotifications 
            : true,
          emailNotifications: settings.toggles?.emailNotifications !== undefined 
            ? settings.toggles.emailNotifications 
            : false,
          autoSave: settings.toggles?.autoSave !== undefined 
            ? settings.toggles.autoSave 
            : true,
          showCompletedTasks: settings.toggles?.showCompletedTasks !== undefined 
            ? settings.toggles.showCompletedTasks 
            : true,
          enableSounds: settings.toggles?.enableSounds !== undefined 
            ? settings.toggles.enableSounds 
            : false,
          keyboardShortcuts: settings.toggles?.keyboardShortcuts !== undefined 
            ? settings.toggles.keyboardShortcuts 
            : true
        }
      };
    }

    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ 
        success: false,
        error: 'User not found' 
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Pengaturan berhasil disimpan',
      user: updateData
    });

  } catch (error) {
    console.error("API Update Error:", error);
    return NextResponse.json({ 
      success: false,
      error: error.message || 'Internal Server Error' 
    }, { status: 500 });
  }
}