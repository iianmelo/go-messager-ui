import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import ProtectedRoute from "@/components/protected-route";

export const metadata: Metadata = {
  title: "Go Messager",
  description: "Chat/message components for Go Messager",
};

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <main className="flex h-[calc(100dvh)] flex-col">
        <div className="z-10 border rounded-lg w-full h-full text-sm flex">
          <ProtectedRoute>{children}</ProtectedRoute>
        </div>
      </main>
    </ThemeProvider>
  );
}
