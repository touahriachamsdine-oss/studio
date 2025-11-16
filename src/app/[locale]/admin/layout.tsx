
import AdminSidebar from '@/components/admin/AdminSidebar';
import { getDictionary } from '@/lib/dictionary';
import type { Locale } from '@/i18n-config';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
// import { redirect } from 'next/navigation'; // Placeholder for auth check

// Placeholder for auth check logic - in a real app, this would be robust
async function checkAdminAuth() {
  // This is a mock. Replace with actual auth check.
  // For demo, we'll allow access. In real app, redirect if not admin.
  const isAdmin = true; // Replace with actual check e.g. from session or token
  if (!isAdmin) {
    // const defaultLocale = 'en'; // Or get from i18n config
    // redirect(`/${defaultLocale}/login?error=unauthorized`); 
  }
  return isAdmin; 
}


export default async function AdminLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  await checkAdminAuth(); // Ensure this is awaited if it's async
  const dictionary = await getDictionary(locale);

  return (
    <SidebarProvider>
      <AdminSidebar dictionary={{...dictionary.admin, appName: dictionary.appName, dashboard: dictionary.dashboard }} locale={locale} />
      <SidebarInset>
        <div className="p-4 md:p-6 animate-fade-in-up">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold">{dictionary.admin.title}</h1>
            <div className="md:hidden">
              <SidebarTrigger />
            </div>
          </div>
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
