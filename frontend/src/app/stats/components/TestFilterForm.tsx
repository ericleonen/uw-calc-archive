"use client"

import { CLASSES, TEST_TYPES } from "@/constants";
import SelectInput from "@/components/select/SelectInput";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/Button";
import SectionHeader from "@/components/text/SectionHeader";
import { useState } from "react";

type TestFilterFormProps = {
    closeSheet?: () => void,
    initialClass?: string,
}

export default function TestFilterForm({ closeSheet, initialClass }: TestFilterFormProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [class_, setClass] = useState(searchParams.get("class") || initialClass || "");
    const [exam, setExam] = useState(searchParams.get("exam") || "");

    const submitDisabled = !class_ || !exam;

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const next = new URLSearchParams(searchParams);

        next.set("class", class_);
        next.set("exam", exam);

        if (closeSheet) closeSheet();

        router.replace(`?${next.toString()}`, { scroll: false })
    };

    return (
        <form onSubmit={onSubmit}>
            <SectionHeader variant="secondary">Test Filter</SectionHeader>
            <div className="mt-2 mb-6 space-y-2">
                <SelectInput
                    label="class"
                    placeholder="Select your class"
                    options={CLASSES}
                    value={class_}
                    setValue={setClass}
                />
                <SelectInput
                    label="exam"
                    placeholder="Select your exam"
                    options={TEST_TYPES}
                    value={exam}
                    setValue={setExam}
                />
            </div>
            <Button disabled={submitDisabled}>Filter tests</Button>
        </form>
    )
}