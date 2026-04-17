import type { Metadata } from "next";
import { ClerkProvider } from "@repo/auth";
import "./globals.css";

export const metadata: Metadata = {
  title: "MedAesthetics — Practice Setup",
  description: "Set up your MedAesthetics practice in minutes.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider>{children}</ClerkProvider>
      </body>
    </html>
  );
}
