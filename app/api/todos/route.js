import { connectDB } from "@/lib/mongodb";
import Todo from "@/models/Todo";

export async function GET() {
  await connectDB();
  const todos = await Todo.find();
  return Response.json(todos);
}

export async function POST(req) {
  await connectDB();
  const { text } = await req.json();
  const newTodo = await Todo.create({ text });
  return Response.json(newTodo);
}
