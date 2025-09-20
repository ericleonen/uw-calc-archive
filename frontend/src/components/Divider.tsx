type DividerProps = {
    text?: string,
    className?: string
}

export default function Divider({ text = "", className = "" }: DividerProps) {
    return (
        <div className={"flex items-center w-full " + className}>
            <div className="grow h-[2px] bg-gray-300 rounded-full" />
            <p className="px-2 text-sm font-bold uppercase text-gray-400/90 shrink-0">{text}</p>
            <div className="grow h-[2px] bg-gray-300 rounded-full" />
        </div>
    )
}