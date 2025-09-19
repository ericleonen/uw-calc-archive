"use client"

import { useEffect, useRef } from "react"
import Select, { type SingleValue } from "react-select"

type SelectInputProps = {
    label: string
    placeholder: string
    options: string[]
    initialValue?: string
}

type Option = { label: string; value: string }

const UW_PURPLE_90 = "color-mix(in oklab, var(--color-uw) 90%, transparent)";
const GRAY_500_90 = "color-mix(in oklab, var(--color-gray-500) 90%, transparent)";
const GRAY_300_90 = "color-mix(in oklab, var(--color-gray-300) 90%, transparent)";
const GRAY_400_90 = "color-mix(in oklab, var(--color-gray-400) 90%, transparent)";
const GRAY_100_90 = "color-mix(in oklab, var(--color-gray-100) 90%, transparent)";
const PURPLE_100_90 = "color-mix(in oklab, var(--color-purple-100) 90%, transparent)";
const PURPLE_200_90 = "color-mix(in oklab, var(--color-purple-200) 90%, transparent)";

export default function SelectInput({
    label,
    placeholder,
    options,
    initialValue = ""
}: SelectInputProps) {
    const optionObjects: Option[] = options.map((o) => ({ label: o, value: o }));
    const hiddenRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (hiddenRef.current) {
            hiddenRef.current.value = initialValue;
        }
    }, [initialValue]);

    return (
        <div className="w-full">
            <input ref={hiddenRef} type="hidden" name={label} />
            <label
                htmlFor={label}
                className="text-xs font-bold tracking-wide uppercase text-uw/90"
            >
                {label}
            </label>

            <Select
                inputId={label}
                options={optionObjects}
                defaultValue={{ value: initialValue, label: initialValue }}
                onChange={(opt: Option | null) => {
                    if (hiddenRef.current) hiddenRef.current.value = opt?.value ?? ''
                }}
                placeholder={placeholder}
                isClearable
                styles={{
                    control: (base, state) => ({
                        ...base,
                        borderWidth: 2,
                        borderColor: state.isFocused ? GRAY_400_90 : GRAY_300_90,
                        boxShadow: "none",
                        ":hover": { borderColor: GRAY_400_90 },
                        fontWeight: 500,
                        color: GRAY_500_90,
                        borderRadius: "calc(var(--radius) - 2px)",
                        padding: 0,
                        minHeight: undefined,
                        outline: state.isFocused ? "2px solid" : 0,
                        outlineColor: PURPLE_200_90
                    }),
                    placeholder: (base) => ({
                        ...base,
                        color: GRAY_400_90,
                        fontWeight: 500,
                        margin: 0
                    }),
                    singleValue: (base) => ({
                        ...base,
                        color: GRAY_500_90,
                        fontWeight: 500,
                        padding: 0,
                        margin: 0
                    }),
                    clearIndicator: (base) => ({
                        ...base,
                        paddingBlock: 0,
                        paddingInline: "calc(var(--spacing) * 1.5)",
                        color: GRAY_300_90,
                        ":hover": { color: GRAY_400_90 }
                    }),
                    indicatorSeparator: (base) => ({
                        ...base,
                        width: 1.6,
                        marginBlock: "var(--spacing)",
                        borderRadius: 999,
                        backgroundColor: GRAY_300_90
                    }),
                    dropdownIndicator: (base) => ({
                        ...base,
                        paddingInline: "calc(var(--spacing) * 1.5)",
                        paddingBlock: 0,
                        color: GRAY_300_90,
                        ":hover": { color: GRAY_400_90 }
                    }),
                    menu: (base) => ({
                        ...base,
                        borderWidth: 1,
                        borderColor: GRAY_300_90,
                        overflow: "hidden",
                        fontWeight: 500,
                        color: GRAY_500_90,
                        marginBlock: "var(--spacing)",
                        borderRadius: "calc(var(--radius) - 2px)",
                    }),
                    menuList: (base) => ({
                        ...base,
                        margin: 0,
                        padding: 0,
                    }),
                    option: (base, state) => ({
                        ...base,
                        backgroundColor: state.isSelected
                            ? PURPLE_100_90
                            : state.isFocused
                            ? GRAY_100_90
                            : "white",
                        color: state.isSelected
                            ? `${UW_PURPLE_90}`
                            : GRAY_500_90,
                        cursor: "pointer",
                        paddingInline: "calc(var(--spacing) * 2)",
                        paddingBlock: "var(--spacing)"
                    }),
                    input: (base) => ({
                        ...base,
                        color: GRAY_500_90,
                        fontWeight: 500,
                        margin: 0,
                        padding: 0
                    }),
                    valueContainer: (base) => ({
                        ...base,
                        paddingInline: "calc(var(--spacing) * 2)",
                        paddingBlock: "var(--spacing)"
                    }),
                    noOptionsMessage: (base) => ({
                        ...base,
                        paddingInline: "calc(var(--spacing) * 2)",
                        paddingBlock: "var(--spacing)",
                        minHeight: undefined,
                        textAlign: "start",
                        margin: 0
                    })
                }}
            />
        </div>
    )
}
