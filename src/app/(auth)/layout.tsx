import { Inter } from "next/font/google";
import { GolangIcon } from "@/assets";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body className={inter.className}>
        <div className="container relative flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
          <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
            <div className="absolute inset-0 bg-primary" />
            <div className="relative z-20 flex items-center text-lg font-medium">
              <Image
                src={GolangIcon}
                alt="Golang Icon"
                width={32}
                height={32}
                className="mr-2"
              />
              Go Message
            </div>
            <div className="relative z-20 mt-auto">
              <blockquote className="space-y-2">
                <p className="text-lg">
                  The fastest way to send messages to your friends and family.
                </p>
                <footer className="text-sm">Go Message</footer>
              </blockquote>
            </div>
          </div>
          <div className="flex h-screen w-full items-center justify-center px-4">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
