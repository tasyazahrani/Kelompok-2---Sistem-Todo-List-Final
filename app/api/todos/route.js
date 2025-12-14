import { NextResponse } from "next/server";
// Mundur 2 langkah (../../) karena file ini ada di dalam folder 'todos'
import { connectDB } from "../../lib/mongodb";
import Todo from "../../models/Todo";

export async function GET() {
  await connectDB();
  const todos = await Todo.find();
  return NextResponse.json(todos);
}

export async function POST(request) {
  await connectDB();
  const { title, description } = await request.json();
  await Todo.create({ title, description });
  return NextResponse.json({ message: "Todo Created" }, { status: 201 });
}

export async function DELETE(request) {
  await connectDB();
  const id = request.nextUrl.searchParams.get("id");
  await Todo.findByIdAndDelete(id);
  return NextResponse.json({ message: "Todo Deleted" }, { status: 200 });
}