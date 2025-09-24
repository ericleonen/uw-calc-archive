import React from "react"

type ListProps = {
    variant?: "ordered" | "unordered"
    children: React.ReactNode,
    className?: string
}

export default function List({ variant = "ordered", children, className = "" }: ListProps) {
    const items = React.Children.map(children, (child, child_index) => (
        <li key={child_index}>{child}</li>
    ));

    className = "text-gray-700/90 font-semibold pl-6 " + className;

    return variant === "ordered" ? (
        <ol className={"list-decimal " + className}>{items}</ol>
    ) : (
        <ul className={"list-disc " + className}>{items}</ul>
    )
}