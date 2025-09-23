import Image from "next/image"

type EmptyProps = {
    imgSrc: string,
    imgAlt: string,
    primaryText: string,
    secondaryText: string,
    secondaryMobileText?: string,
    children?: React.ReactNode
}

export default function Empty({ imgSrc, imgAlt, primaryText, secondaryText, secondaryMobileText, children }: EmptyProps) {
    return (
        <div className="flex flex-col items-center w-full max-w-md px-3 py-16 mx-auto text-center">
            <div className="w-40 h-40 mb-2">
                <Image src={imgSrc} alt={imgAlt} width={160} height={160} />
            </div>
            <h2 className="text-2xl font-bold text-uw/90">{primaryText}</h2>
            <p className="mt-1 font-medium text-gray-500/90 hidden lg:block">{secondaryText}</p>
            <p className="mt-1 font-medium text-gray-500/90 lg:hidden">{secondaryMobileText || secondaryText}</p>
            {children}
        </div>
    )
}