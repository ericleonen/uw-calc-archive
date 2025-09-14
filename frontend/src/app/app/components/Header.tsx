import Link from "next/link";

export default function Header() {
    return (
        <header className="flex items-center w-full px-6 h-14 bg-uw">
            <h1 className="font-bold text-white/90">UW CalcArchive</h1>
            <div className="hidden ml-auto space-x-8 lg:flex">
                <HeaderLink label="Search" to="search" />
                <HeaderLink label="About" to="about" />
                <HeaderLink label="Sign up" to="signup" />
            </div>
        </header>
    )
}

type HeaderLinkProps = {
    label: string,
    to: string
}

function HeaderLink({ label, to }: HeaderLinkProps) {
    return (
        <Link 
            href={`app/${to}`}
            className="text-white/90"
        >
            {label}
        </Link>
    )
}