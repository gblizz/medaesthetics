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
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 bg-black">
        <div className="mx-auto flex h-20 max-w-5xl items-center justify-between px-6">
          <a
            href={process.env.NEXT_PUBLIC_MARKETING_URL ?? "http://localhost:3002"}
            style={{ color: "#ffffff" }}
            className="font-serif text-2xl tracking-[0.12em]"
          >
            Refined Aesthetic
          </a>
          <nav className="flex items-center gap-8">
            {[
              { href: "/dashboard", label: "Dashboard" },
              { href: "/book", label: "Book" },
              { href: "/records", label: "Records" },
              { href: "/invoices", label: "Invoices" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                style={{ color: "#999999" }}
                className="hidden text-[11px] tracking-[0.2em] uppercase transition-colors hover:text-white md:block"
              >
                {link.label}
              </a>
            ))}
            <UserButton afterSignOutUrl="/sign-in" />
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-14">{children}</main>
    </div>
  );
}
