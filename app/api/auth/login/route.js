import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export async function POST(req) {
    try {
        const { email, password } = await req.json();
        await connectDB();


        const user = await User.findOne({ email });
        if (!user) {
            return Response.json({ success: false, message: "User not found" }, { status: 404 });
        }


        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return Response.json({ success: false, message: "Invalid password" }, { status: 401 });
        }


        const cookieStore = await cookies();
        cookieStore.set("token", "adminToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
            path: "/",
            maxAge: 60 * 60 * 24,
        });



        return Response.json({
            success: true,
            message: "Login successful",
            user: {
                name: user.name,
                email: user.email,
            },
        }, { status: 200 });
    } catch (err) {
        console.error("Login Error:", err);
        return Response.json({ success: false, message: err.message }, { status: 500 });
    }
}