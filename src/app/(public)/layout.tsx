import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FloatingElements } from "@/components/home/floating-elements";
import { UserPopupModal } from "@/components/announcements/user-popup-modal";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingElements />
      <UserPopupModal />
    </div>
  );
}
