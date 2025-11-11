import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {
        const { name, email, password } = await req.json();

        await connectDB();


        const existing = await User.findOne({ email });
        if (existing) {
            return Response.json({ success: false, message: "Email already exists!" }, { status: 400 });
        }


        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        return Response.json({ success: true, user: newUser }, { status: 201 });
    } catch (err) {
        return Response.json({ success: false, message: err.message }, { status: 500 });
    }
}