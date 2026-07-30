import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { StaffPopupModal } from "@/components/announcements/staff-popup-modal";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900 antialiased">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto bg-slate-50/70">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
            {children}
          </div>
        </main>
      </div>
      <StaffPopupModal />
    </div>
  );
}
