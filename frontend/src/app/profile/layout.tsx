type ProfileLayoutProps = {
    children: React.ReactNode
}

export default function ProfileLayout({ children }: ProfileLayoutProps) {
    return (
        <div className="flex flex-col items-center w-full h-full py-16 overflow-y-scroll">
            {children}
        </div>
    );
}