type ProfileLayoutProps = {
    children: React.ReactNode
}

export default function ProfileLayout({ children }: ProfileLayoutProps) {
    return (
        <div className="flex flex-col h-full w-full items-center py-16">
            {children}
        </div>
    );
}