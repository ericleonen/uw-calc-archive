type TextInputProps = {
    for_: string,
    placeholder?: string,
    disabled?: boolean,
    initialValue?: string
}

export default function TextInput({ for_, placeholder = "", disabled = false, initialValue = "" }: TextInputProps) {
    return (
        <div className="w-full">
            <label
                htmlFor={for_}
                className="w-full text-xs font-bold tracking-wide uppercase text-uw/90"
            >
                {for_}
            </label>
            <input 
                id={for_}
                name={for_}
                type={for_}
                placeholder={placeholder}
                defaultValue={initialValue}
                required
                disabled={disabled}
                className="w-full px-2 py-1 font-medium border-2 border-gray-300 rounded-md focus:border-gray-400 hover:border-gray-400 focus:outline-2 focus:outline-purple-200 text-gray-500/90 placeholder:text-gray-400/90 disabled:pointer-events-none"
            />
        </div>
    )
}