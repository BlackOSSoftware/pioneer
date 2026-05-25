import { cookies } from "next/headers";

const ADMIN_TOKEN = "adminToken";

export async function getAdminToken() {
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value ?? null;
}

export async function isAdminRequest() {
  const token = await getAdminToken();
  return token === ADMIN_TOKEN;
}

export function adminUnauthorized() {
  return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
}
