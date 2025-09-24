type EmphasisProps = {
    children: React.ReactNode,
    variant?: "primary" | "secondary"
}

export default function Emphasis({ children, variant = "primary" }: EmphasisProps) {
    return (
        <span className={"font-semibold " + (variant === "primary" ? "text-uw" : "")}>
            {children}
        </span>
    )
}