"use client"

import { CLASSES, TEST_TYPES, TOPICS } from "@/constants";
import SelectInput from "@/components/select/SelectInput";
import MultiSelectInput from "@/components/select/MultiSelectInput";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/Button";
import { useEffect, useState } from "react";
import SectionHeader from "@/components/text/SectionHeader";

type QuestionFilterFormProps = {
    closeSheet?: () => void,
    initialClass?: string
}

export default function QuestionFilterForm({ closeSheet, initialClass }: QuestionFilterFormProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [class_, setClass] = useState(searchParams.get("class") || initialClass || "");
    const exam = searchParams.get("exam") || "";
    const [topics, setTopics] = useState<string[]>(searchParams.has("topics") ? searchParams.get("topics")?.split(",") || [] : [])

    useEffect(() => {
        setTopics([]);
    }, [class_, setTopics]);

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const next = new URLSearchParams(searchParams);

        next.set("class", String(formData.get("class")));
        next.set("exam", String(formData.get("exam")));
        next.set("topics", String(formData.get("topics")));
        next.set("page", "1");

        if (closeSheet) closeSheet();

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
                    initialValue={exam}
                />
                <MultiSelectInput
                    label="topics"
                    placeholder="Select topics"
                    options={TOPICS[class_] || []}
                    values={topics}
                    setValues={setTopics}
                />
            </div>
            <Button>Filter questions</Button>
        </form>
    )
}