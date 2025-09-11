import { Label } from "@/components/ui/label"
import { MultiSelect, MultiSelectContent, MultiSelectGroup, MultiSelectItem, MultiSelectTrigger, MultiSelectValue } from "@/components/ui/multi-select"

type SearchMultiSelectProps = {
    label: string,
    placeholder: string,
    options: string[],
    values: string[],
    setValues: React.Dispatch<React.SetStateAction<string[]>>
}

export default function SearchMultiSelect({ label, placeholder, options, values, setValues }: SearchMultiSelectProps) {
    return (
        <>
            <Label 
                htmlFor={label}
                className="text-xs font-bold tracking-wide uppercase text-uw/90"
            >
                {label}
            </Label>
            <MultiSelect values={values} onValuesChange={setValues}>
                <MultiSelectTrigger 
                    id={label}
                    className="w-full font-semibold border-2 border-gray-300/90 text-gray-500/90"
                >
                    <MultiSelectValue placeholder={placeholder} overflowBehavior="wrap" />
                </MultiSelectTrigger>
                <MultiSelectContent className="font-semibold border-2 border-gray-300/90 text-gray-500/90">
                    <MultiSelectGroup>
                        {
                            options.map(option => (
                                <MultiSelectItem 
                                    key={option}
                                    value={option}
                                    className="
                                        data-[state=checked]:bg-purple-100/90 data-[state=checked]:text-uw/90 
                                        data-[highlighted]:bg-gray-100/90 data-[highlighted]:text-gray-500/90
                                    "
                                >
                                    {option}
                                </MultiSelectItem>
                            ))
                        }
                        </MultiSelectGroup>
                </MultiSelectContent>
            </MultiSelect>
        </>
    )
}