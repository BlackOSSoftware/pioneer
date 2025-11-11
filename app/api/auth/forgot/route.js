import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req) {
    try {
        const { email } = await req.json();
        await connectDB();

        const user = await User.findOne({ email });
        if (!user) {
            return Response.json({ success: false, message: "No user with this email" }, { status: 404 });
        }



        return Response.json({ success: true, message: "Reset link sent to email (mock)" });
    } catch (err) {
        return Response.json({ success: false, message: err.message }, { status: 500 });
    }
}