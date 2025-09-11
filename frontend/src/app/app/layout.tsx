import Header from "./components/Header";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
        <div className="flex flex-col h-screen">
            <Header />
            <main className="flex bg-gray-300 grow">
                {children}
            </main>
        </div>
    )
}