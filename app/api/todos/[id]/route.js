import { connectDB } from "../../../lib/mongodb"; // Naik 3 langkah
import Todo from "../../../models/Todo";

export async function PUT(req, { params }) {
  await connectDB();
  const { done } = await req.json();
  const todo = await Todo.findByIdAndUpdate(
    params.id,
    { done },
    { new: true }
  );
  return Response.json(todo);
}

export async function DELETE(req, { params }) {
  await connectDB();
  await Todo.findByIdAndDelete(params.id);
  return Response.json({ message: "deleted" });
}
