import { Navbar } from "@/components/navbar";
import { AdminContent } from "@/components/admin-content";

export const metadata = {
  title: "Admin | Her Own",
  description: "Order management for Her Own.",
};

export default function AdminPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0f0f12] px-4 py-8 pb-24">
        <AdminContent />
      </main>
    </>
  );
}
