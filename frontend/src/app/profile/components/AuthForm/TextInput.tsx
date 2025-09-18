type TextInputProps = {
    for_: string,
    placeholder: string
}

export default function TextInput({ for_, placeholder }: TextInputProps) {
    return (
        <div className="w-full">
            <label
                htmlFor={for_}
                className="w-full text-xs uppercase tracking-wide font-bold text-uw/90"
            >
                {for_}
            </label>
            <input 
                id={for_}
                name={for_}
                type={for_}
                placeholder={placeholder}
                required
                className="focus:outline-2 focus:outline-purple-200/90 text-gray-500/90 placeholder:text-gray-400/90 font-medium w-full border-2 border-gray-300/90 rounded-md px-2 py-1"
            />
        </div>
    )
}