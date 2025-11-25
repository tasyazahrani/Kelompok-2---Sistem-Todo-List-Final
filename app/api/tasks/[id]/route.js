// Pastikan PUT method bekerja dengan benar
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const updateData = await request.json();
    
    // Update di database
    const result = await db.collection('tasks').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    
    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Task tidak ditemukan' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Task berhasil diupdate' 
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}