import Header from "./components/Header";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
        <div className="flex flex-col h-screen overflow-hidden">
            <Header />
            <main className="flex bg-gray-300 grow h-[calc(100vh-3.5rem)]">
                {children}
            </main>
        </div>
    )
}