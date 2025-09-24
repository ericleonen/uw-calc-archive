import Image from "next/image"
import Paragraph from "./text/Paragraph"

type EmptyProps = {
    imgSrc: string,
    imgAlt: string,
    primaryText: string,
    secondaryText: string
    secondaryMobileText?: string
    children?: React.ReactNode
}

export default function Empty({ imgSrc, imgAlt, primaryText, secondaryText, secondaryMobileText, children }: EmptyProps) {
    return (
        <div className="flex flex-col items-center w-full max-w-md px-6 py-16 mx-auto text-center">
            <div className="w-40 h-40 mb-2">
                <Image src={imgSrc} alt={imgAlt} width={160} height={160} />
            </div>
            <h2 className="text-2xl font-bold text-uw/90">{primaryText}</h2>
            <Paragraph className="hidden mt-1 lg:block">{secondaryText}</Paragraph>
            <Paragraph className="mt-1 lg:hidden">{secondaryMobileText || secondaryText}</Paragraph>
            {children}
        </div>
    )
}