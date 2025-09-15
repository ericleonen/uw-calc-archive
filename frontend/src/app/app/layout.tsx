import AppBar from "./components/AppBar";
import Header from "./components/Header";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
        <div className="flex flex-col h-screen overflow-hidden">
            <Header />
            <main className="flex bg-gray-200 grow relative min-h-0">
                {children}
            </main>
            <AppBar />
        </div>
    )
}