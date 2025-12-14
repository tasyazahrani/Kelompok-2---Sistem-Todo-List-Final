import { NextResponse } from "next/server";
// Mundur 3 langkah (../../../) karena file ini lebih dalam posisinya
import { connectDB } from "../../../lib/mongodb";
import Todo from "../../../models/Todo";

export async function PUT(request, { params }) {
  const { id } = params;
  const { newTitle: title, newDescription: description } = await request.json();
  
  await connectDB();
  await Todo.findByIdAndUpdate(id, { title, description });
  return NextResponse.json({ message: "Todo Updated" }, { status: 200 });
}

export async function GET(request, { params }) {
  const { id } = params;
  
  await connectDB();
  const todo = await Todo.findOne({ _id: id });
  return NextResponse.json({ todo }, { status: 200 });
}