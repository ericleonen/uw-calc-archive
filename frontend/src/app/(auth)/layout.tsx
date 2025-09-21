import { requireNoUser } from "@/server/guards";

type AuthLayoutProps = {
    children: React.ReactNode
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
    await requireNoUser();

    return (
        <div className="flex flex-col items-center w-full h-full py-16">
            {children}
        </div>
    );
}