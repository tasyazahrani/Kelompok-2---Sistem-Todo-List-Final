export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    // Validasi ID
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Task ID required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('todolist');
    
    // Hapus task dari database
    const result = await db.collection('tasks').deleteOne(
      { _id: new ObjectId(id) }
    );
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Task tidak ditemukan' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Task berhasil dihapus' 
    });
    
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}