import puppeteer from "puppeteer";

export async function GET(req) {
    const url = req.nextUrl.searchParams.get("url");

    if (!url) {
        return new Response("URL missing", { status: 400 });
    }

    const browser = await puppeteer.launch({
        headless: "new",
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.goto(url, {
        waitUntil: "networkidle0",
    });

    const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: {
            top: "20px",
            right: "20px",
            bottom: "20px",
            left: "20px",
        },
    });

    await browser.close();

    return new Response(pdfBuffer, {
        status: 200,
        headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": "attachment; filename=sip-report.pdf",
        },
    });
}