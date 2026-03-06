import { auth } from "@repo/auth";
import { redirect } from "next/navigation";
import { UserButton } from "@repo/auth";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
          <span className="text-lg font-bold text-indigo-600">Patient Portal</span>
          <nav className="flex items-center gap-6">
            <a href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">
              Dashboard
            </a>
            <a href="/book" className="text-sm text-gray-600 hover:text-gray-900">
              Book
            </a>
            <a href="/records" className="text-sm text-gray-600 hover:text-gray-900">
              My Records
            </a>
            <a href="/invoices" className="text-sm text-gray-600 hover:text-gray-900">
              Invoices
            </a>
            <UserButton afterSignOutUrl="/sign-in" />
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8">{children}</main>
    </div>
  );
}
