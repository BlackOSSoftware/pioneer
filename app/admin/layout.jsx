export const metadata = {
  title: "Admin Dashboard | Pioneer Wealth",
  description: "Admin panel without Navbar and Footer",
};

export default function AdminLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">{children}</body>
    </html>
  );
}
