/** Google Search Console HTML-file verification — served at /google6a60f7e35d18e395.html */
export const dynamic = "force-static";

export function GET() {
  return new Response("google-site-verification: google6a60f7e35d18e395.html\n", {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
