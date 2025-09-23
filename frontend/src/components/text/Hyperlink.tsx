import Link from "next/link"

type HyperlinkProps = {
    href: string,
    children: React.ReactNode,
    className?: string
}

export default function Hyperlink({ href, children, className = "" }: HyperlinkProps) {
    return (
        <Link
            href={href}
            className={
                "underline text-uw/90 hover:text-uw-light/90 " + className
            }
        >
            {children}
        </Link>
    )
}