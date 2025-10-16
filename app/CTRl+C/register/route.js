import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { name, email, password, role = "visitor", language = "es" } = await req.json();

    await connectDB();

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json({ error: "El correo ya está registrado" }, { status: 400 });
    }

    // Hashear contraseña antes de guardar
    const passwordHash = await bcrypt.hash(password, 10);

    // Crear usuario nuevo
    const newUser = new User({
      name,
      email,
      passwordHash,
      role,
      language,
      createdAt: new Date(),
    });

    await newUser.save();

    return Response.json({ message: "Usuario registrado correctamente" }, { status: 201 });
  } catch (error) {
    console.error("❌ Error al registrar usuario:", error);
    return Response.json({ error: "Error al registrar usuario" }, { status: 500 });
  }
}
