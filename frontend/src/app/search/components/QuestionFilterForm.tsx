"use client"

import { CLASSES, TEST_TYPES, TOPICS } from "@/constants";
import SelectInput from "@/components/select/SelectInput";
import MultiSelectInput from "@/components/select/MultiSelectInput";
import { SheetClose } from "@/components/ui/sheet";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/Button";
import { useEffect, useState } from "react";
import SectionHeader from "@/components/text/SectionHeader";

type QuestionFilterFormProps = {
    sheetClose?: boolean
}

export default function QuestionFilterForm({ sheetClose }: QuestionFilterFormProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [class_, setClass] = useState(searchParams.get("class") || "");
    const testType = searchParams.get("exam") || "";
    const topicsStr = searchParams.get("topics") || "";

    useEffect(() => {
        setClass(searchParams.get("class") || "");
    }, [setClass, searchParams.get("class")]);

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const next = new URLSearchParams(searchParams);

        next.set("class", String(formData.get("class")));
        next.set("exam", String(formData.get("exam")));
        next.set("topics", String(formData.get("topics")));
        next.set("page", "1");

        router.replace(`?${next.toString()}`, { scroll: false })
    };

    return (
        <form onSubmit={onSubmit}>
            <SectionHeader variant="secondary">Questions Filter</SectionHeader>
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
                    initialValue={testType}
                />
                <MultiSelectInput
                    label="topics"
                    placeholder="Select topics"
                    options={TOPICS[class_] || []}
                    initialValuesStr={topicsStr}
                />
            </div>
            {
                sheetClose ? (
                    <SheetClose className="w-full" asChild>
                        <Button>Filter questions</Button>
                    </SheetClose>
                ) : <Button>Filter questions</Button>
            }
        </form>
    )
}