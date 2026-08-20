import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="ml-72 min-h-screen">
        <Navbar />

        <main className="p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}