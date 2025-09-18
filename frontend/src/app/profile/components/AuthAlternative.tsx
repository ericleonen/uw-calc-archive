import Link from "next/link"

type AuthAlternativeProps = {
    question: string,
    linkLabel: string,
    href: string
}

export default function AuthAlternative({ question, linkLabel, href }: AuthAlternativeProps) {
    return (
        <div className="font-medium mt-2">
            <span className="text-gray-500/90">{question}</span>
            <Link
                href={href}
                className="ml-1 text-uw/90 underline hover:text-uw/70"
            >
                {linkLabel}
            </Link>
    </div>
    );
}