import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/app/providers";
import Header from "@/components/Header";
import AppBar from "@/components/AppBar";

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap" 
})

export const metadata: Metadata = {
  title: "UW CalcArchive",
  description: "Past test questions archive for MATH 124/5/6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={openSans.className}>
        <Providers>
          <div className="flex flex-col h-screen overflow-hidden">
              <Header />
              <main className="flex bg-gray-200 grow relative min-h-0">
                  {children}
              </main>
              <AppBar />
          </div>
        </Providers>
      </body>
    </html>
  );
}
