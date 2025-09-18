import { CLASSES, TEST_TYPES, TOPICS } from "../../constants";
import SelectInput from "./SelectInput";
import MultiSelectInput from "./MultiSelectInput";
import { SheetClose } from "@/components/ui/sheet";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

type QuestionFilterFormProps = {
    sheetClose?: boolean
}

export default function QuestionFilterForm({ sheetClose }: QuestionFilterFormProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const [class_, setClass] = useState(searchParams.get("class") || "");
    const [testType, setTestType] = useState(searchParams.get("exam") || "");
    const [topics, setTopics] = useState<string[]>(searchParams.get("topics")?.split(",") || []);

    useEffect(() => {
        setClass(searchParams.get("class") || "");
        setTestType(searchParams.get("exam") || "");
        setTopics(searchParams.get("topics")?.split(",") || []);
    }, [searchParams]);

    const updateQuestionQuery = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("class", class_);
        params.set("exam", testType);
        params.set("topics", topics.join(","));
        params.delete("page")

        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const filterButton = (
        <button
            onClick={updateQuestionQuery}
            className="rounded-md py-1 px-2 w-full font-semibold disabled:hover:cursor-default hover:cursor-pointer bg-uw/90 text-white/90 hover:bg-uw/70"
        >
            Filter questions
        </button>
    );

    return (
        <>
            <p className="flex items-center font-bold text-gray-700/90">
                Questions Filter
            </p>
            <div className="mt-3 space-y-3 mb-9">
                <SelectInput
                    label="Class"
                    placeholder="Select your class"
                    options={CLASSES}
                    value={class_}
                    setValue={setClass}
                />
                <SelectInput
                    label="Exam"
                    placeholder="Select your exam"
                    options={TEST_TYPES}
                    value={testType}
                    setValue={setTestType}
                />
                <MultiSelectInput
                    label="Topics"
                    placeholder="Select topics"
                    options={TOPICS[class_] || []}
                    values={topics}
                    setValues={setTopics}
                />
            </div>
            {
                sheetClose ? (
                    <SheetClose className="w-full" asChild>
                        {filterButton}
                    </SheetClose>
                ) : filterButton
            }
        </>
    )
}