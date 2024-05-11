import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Sidebar from "@/components/sidebar";
import Topbar from "@/components/topbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className + " relative text-neutral-1000 dark:text-darkNeutral-1000 bg-neutral-100 dark:bg-darkNeutral-100"}>
        <Providers>
          <Topbar />
          <div className="sm:flex">
            <Sidebar />
            <div className="w-full">
              {children}
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
