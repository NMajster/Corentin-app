import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <DashboardHeader />

      <div className="flex">
        {/* Sidebar Navigation */}
        <DashboardNav />

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 pt-16">
          <div className="p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}


