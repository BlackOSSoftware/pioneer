import "./globals.css";
import ClientRootLayout from "./ClientRootLayout";

export const metadata = {
  title: "Pioneer Wealth",
  description: "Financial Planning Website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
      </head>

      {/* 👇 Client-only logic is now inside ClientRootLayout */}
      <body className="bg-gray-50 flex flex-col min-h-screen">
        <ClientRootLayout>{children}</ClientRootLayout>
      </body>
    </html>
  );
}
