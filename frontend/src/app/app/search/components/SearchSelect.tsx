import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label"

type SearchSelectProps = {
    label: string,
    placeholder: string,
    options: string[],
    value: string,
    setValue: React.Dispatch<React.SetStateAction<string>>
}

export default function SearchSelect({ label, placeholder, options, value, setValue }: SearchSelectProps) {
    return (
        <>
            <Label 
                htmlFor={label}
                className="text-xs font-bold tracking-wide uppercase text-uw/90"
            >
                {label}
            </Label>
            <Select value={value} onValueChange={setValue}>
                <SelectTrigger 
                    id={label}
                    className="w-full font-semibold border-2 border-gray-300/90 text-gray-500/90"
                >
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent className="font-semibold border-2 border-gray-300/90 text-gray-500/90">
                    <SelectGroup>
                        {
                            options.map(option => (
                                <SelectItem 
                                    key={option}
                                    value={option}
                                    className="
                                        data-[state=checked]:bg-purple-100/90 data-[state=checked]:text-uw/90 
                                        data-[highlighted]:bg-gray-100/90 data-[highlighted]:text-gray-500/90
                                    "
                                >
                                    {option}
                                </SelectItem>
                            ))
                        }
                        </SelectGroup>
                </SelectContent>
            </Select>
        </>
    )
}