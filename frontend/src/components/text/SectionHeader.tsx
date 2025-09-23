type SectionHeaderProps = {
    variant?: "primary" | "secondary",
    children: React.ReactNode
}

export default function SectionHeader({ variant = "primary", children }: SectionHeaderProps) {
    return (
        <h2 className={
            "font-bold text-gray-700/90 " +
            (variant === "primary" ? "text-lg" : "text-md")
        }>
            {children}
        </h2>
    )
}