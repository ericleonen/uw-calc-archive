"use client"

import { useEffect, useRef } from "react";
import Select from "react-select";
import { asOption } from "./utils";

type BaseProps = {
    label: string
    placeholder: string
    options: string[]
};

type ControlledProps = BaseProps & {
    value: string,
    setValue: React.Dispatch<React.SetStateAction<string>>
};

type UncontrolledProps = BaseProps & {
    initialValue: string
};

type SelectInputProps = ControlledProps | UncontrolledProps;

export default function SelectInput(props: SelectInputProps) {
    const { label, placeholder, options } = props;
    const isControlled = !("initialValue" in props);
    const hiddenRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isControlled && hiddenRef.current) {
            hiddenRef.current.value = props.value;
        }
    }, [isControlled && props.value]);

    useEffect(() => {
        if (!isControlled && hiddenRef.current) {
            hiddenRef.current.value = props.initialValue;
        }
    }, [!isControlled && props.initialValue]);

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
                options={options.map(asOption)}
                defaultValue={!isControlled && props.initialValue ? asOption(props.initialValue) : undefined}
                value={isControlled && props.value ? asOption(props.value) : undefined}
                onChange={(option: Option | null) => {
                    if (isControlled) props.setValue(option?.value || "");
                    else if (hiddenRef.current) hiddenRef.current.value = option?.value ?? "";
                }}
                placeholder={placeholder}
                isClearable
                styles={{
                    control: (base, state) => ({
                        ...base,
                        borderWidth: 2,
                        borderColor: state.isFocused ? "var(--color-gray-400)" : "var(--color-gray-300)",
                        boxShadow: "none",
                        ":hover": { borderColor: "var(--color-gray-400)" },
                        fontWeight: 500,
                        color: "color-mix(in oklab, var(--color-gray-500) 90%, transparent)",
                        borderRadius: "calc(var(--radius) - 2px)",
                        padding: 0,
                        minHeight: undefined,
                        outline: state.isFocused ? "2px solid" : 0,
                        outlineColor: "var(--color-purple-200)"
                    }),
                    placeholder: (base) => ({
                        ...base,
                        color: "color-mix(in oklab, var(--color-gray-400) 90%, transparent)",
                        fontWeight: 500,
                        margin: 0
                    }),
                    singleValue: (base) => ({
                        ...base,
                        color: "color-mix(in oklab, var(--color-gray-500) 90%, transparent)",
                        fontWeight: 500,
                        padding: 0,
                        margin: 0
                    }),
                    clearIndicator: (base) => ({
                        ...base,
                        paddingBlock: 0,
                        paddingInline: "calc(var(--spacing) * 1.5)",
                        color: "var(--color-gray-300)",
                        ":hover": { color: "var(--color-gray-400)" }
                    }),
                    indicatorSeparator: (base) => ({
                        ...base,
                        width: 1.6,
                        marginBlock: "var(--spacing)",
                        borderRadius: 999,
                        backgroundColor: "var(--color-gray-300)"
                    }),
                    dropdownIndicator: (base) => ({
                        ...base,
                        paddingInline: "calc(var(--spacing) * 1.5)",
                        paddingBlock: 0,
                        color: "color-mix(in oklab, var(--color-gray-300) 90%, transparent)",
                        ":hover": { color: "var(--color-gray-400)" }
                    }),
                    menu: (base) => ({
                        ...base,
                        borderWidth: 1,
                        borderColor: "var(--color-gray-300)",
                        overflow: "hidden",
                        fontWeight: 500,
                        color: "color-mix(in oklab, var(--color-gray-500) 90%, transparent)",
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
                            ? "var(--color-purple-100)"
                            : state.isFocused
                            ? "var(--color-gray-100)"
                            : "white",
                        color: state.isSelected
                            ? "color-mix(in oklab, var(--color-uw) 90%, transparent)"
                            : "color-mix(in oklab, var(--color-gray-500) 90%, transparent)",
                        cursor: "pointer",
                        paddingInline: "calc(var(--spacing) * 2)",
                        paddingBlock: "var(--spacing)"
                    }),
                    input: (base) => ({
                        ...base,
                        color: "color-mix(in oklab, var(--color-gray-500) 90%, transparent)",
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
