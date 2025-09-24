"use client"

import React, { useEffect, useRef } from "react"
import Select from "react-select"
import { asOption } from "./utils";

type BaseProps = {
    label: string,
    placeholder: string,
    options: string[]
}

type ControlledProps = BaseProps & {
    values: string[],
    setValues: React.Dispatch<React.SetStateAction<string[]>>
};

type UncontrolledProps = BaseProps & {
    initialValuesStr: string
};


type MultiSelectInputProps = ControlledProps | UncontrolledProps; 

export default function MultiSelectInput(props: MultiSelectInputProps) {
    const { label, placeholder, options } = props;
    const isControlled = "values" in props;
    const hiddenRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isControlled && hiddenRef.current) {
            hiddenRef.current.value = props.values.join(",");
        }
    }, [isControlled && props.values]);

    useEffect(() => {
        if (!isControlled && hiddenRef.current) {
            hiddenRef.current.value = props.initialValuesStr;
        }
    }, [!isControlled && props.initialValuesStr]);

    return (
        <div className="w-full">
            <input ref={hiddenRef} type="hidden" name={label} />
            <label
                htmlFor={label}
                className="text-xs font-bold tracking-wide uppercase text-uw/90"
            >
                {label}
            </label>
            <Select<Option, true>
                inputId={label}
                isMulti
                options={options.map(asOption)}
                defaultValue={
                    !isControlled && props.initialValuesStr ? 
                    props.initialValuesStr.split(",").map(asOption) : 
                    undefined
                }
                value={isControlled && props.values ? props.values.map(asOption) : undefined}
                onChange={(options_: readonly Option[] | null) => {
                    if (isControlled) props.setValues(options_?.map(o => o.value) || []);
                    else if (hiddenRef.current) hiddenRef.current.value = options_?.map(o => o.value).join(",") || "";
                }}
                placeholder={placeholder}
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
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
                        paddingInline: 0,
                        paddingBlock: "calc(var(--spacing) / 2)"
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
                    }),
                    multiValue: (base) => ({
                        ...base,
                        backgroundColor: "var(--color-purple-100)",
                        borderRadius: 999,
                    }),
                    multiValueLabel: (base) => ({
                        ...base,
                        color: "color-mix(in oklab, var(--color-uw) 90%, transparent)",
                        fontWeight: 600,
                        paddingLeft: "calc(var(--spacing) * 2)",
                        fontSize: "var(--text-xs)",
                        lineHeight: "var(--tw-leading, var(--text-xs--line-height))",
                        paddingBlock: "var(--spacing)",
                    }),
                    multiValueRemove: (base) => ({
                        ...base,
                        color: "color-mix(in oklab, var(--color-uw) 90%, transparent)",
                        ":hover": {
                            backgroundColor: "var(--color-purple-200)",
                            color: "color-mix(in oklab, var(--color-uw) 90%, transparent)",
                        },
                        borderTopRightRadius: 999,
                        borderBottomRightRadius: 999,
                        paddingLeft: "calc(var(--spacing) / 2)",
                        paddingRight: "var(--spacing)"
                    }),
                }}
            />
        </div>
    )
}