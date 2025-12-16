import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

export default function AdminLayout({ children }) {
  return (
    <div className="flex">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN AREA */}
      <div className="ml-64 w-full min-h-screen bg-[var(--background)]">

        {/* TOPBAR */}
        <Topbar />

        {/* PAGE CONTENT */}
        <main className=" pt-16 p-6 min-h-screen bg-gray-50 dark:bg-slate-950">
  {children}
</main>

         
      </div>
    </div>
  );
}
