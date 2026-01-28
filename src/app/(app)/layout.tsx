import AppNavbar from "@/components/layout/AppNavbar";
import AppPageHeader from "@/components/layout/AppPageHeader";
import { PageTitleProvider } from "@/components/layout/PageTitleProvider";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <PageTitleProvider>
      <div className="min-h-screen bg-gray-100">
        <AppNavbar />
        <AppPageHeader />

        <div className="py-12">
          <main>
            <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </PageTitleProvider>
  );
}
