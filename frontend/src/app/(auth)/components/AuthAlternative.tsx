import Hyperlink from "@/components/text/Hyperlink";
import Paragraph from "@/components/text/Paragraph";

type AuthAlternativeProps = {
    question: string,
    linkLabel: string,
    href: string
}

export default function AuthAlternative({ question, linkLabel, href }: AuthAlternativeProps) {
    return (
        <div className="flex mt-2 font-medium">
            <Paragraph>{question}</Paragraph>
            <Hyperlink
                href={href}
                className="ml-1"
            >
                {linkLabel}
            </Hyperlink>
    </div>
    );
}