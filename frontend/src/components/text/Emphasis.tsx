type EmphasisProps = {
    children: React.ReactNode,
    variant?: "primary" | "secondary"
}

export default function Emphasis({ children, variant = "primary" }: EmphasisProps) {
    return (
        <b className={variant === "primary" ? "text-uw" : ""}>
            {children}
        </b>
    )
}