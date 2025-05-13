import AdminNavbar from "../components/adminNavbar";
import ProtectedRoute from "./(components)/ProtectedRoute";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex bg-neutral-900">
      <ProtectedRoute>
        <AdminNavbar />
        {children}
      </ProtectedRoute>
    </div>
  );
}
