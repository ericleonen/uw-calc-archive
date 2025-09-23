type ParagraphProps = {
    children: React.ReactNode,
    className?: string
}

export default function Paragraph({ children, className = "" }: ParagraphProps) {
    return (
        <p className={
            "font-medium text-gray-600/90 " + className
        }>
            {children}
        </p>
    )
}