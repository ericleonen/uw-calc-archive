import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import AppBar from "@/components/MobileAppBar";

const openSans = Open_Sans({
    subsets: ["latin"],
    display: "swap" 
})

export const metadata: Metadata = {
    title: "HuskyCalcArchive",
    description: "Exam questions archive for MATH 124/5/6 at the University of Washington",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={openSans.className}>
                <div className="flex flex-col h-dvh overflow-hidden">
                        <Header />
                        <main className="flex bg-gray-200 grow relative min-h-0">
                                {children}
                        </main>
                        <AppBar />
                </div>
            </body>
        </html>
    );
}
