import Link from "next/link";

export default function Header() {
    return (
        <div className="flex items-center px-6 h-14 w-full bg-uw">
            <h1 className="text-white/90 font-bold">UW CalcArchive</h1>
            <div className="flex ml-auto space-x-8">
                <HeaderLink label="Search" to="search" />
                <HeaderLink label="About" to="about" />
                <HeaderLink label="Sign up" to="signup" />
            </div>
        </div>
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