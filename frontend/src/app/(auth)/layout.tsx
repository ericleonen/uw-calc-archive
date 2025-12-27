type AuthLayoutProps = {
    children: React.ReactNode
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="flex flex-col items-center w-full h-full py-16">
            {children}
        </div>
    );
}