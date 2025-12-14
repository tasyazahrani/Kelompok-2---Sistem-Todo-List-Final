import { connectDB } from "../../lib/mongodb";  // Naik 2 langkah
import Todo from "../../../models/Todo";          // Sesuaikan juga jalurnya

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
