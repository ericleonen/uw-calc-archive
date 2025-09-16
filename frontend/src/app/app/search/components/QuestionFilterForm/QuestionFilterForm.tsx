import { CLASSES, TEST_TYPES, TOPICS } from "../../constants";
import SelectInput from "./SelectInput";
import MultiSelectInput from "./MultiSelectInput";
import { Button } from "@/components/ui/button";
import { SheetClose } from "@/components/ui/sheet";
import { FilterIcon, LoaderCircleIcon } from "lucide-react";
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

        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const filterButton = (
        <Button
            onClick={updateQuestionQuery}
            className="w-full font-semibold disabled:hover:cursor-default hover:cursor-pointer bg-uw/90 text-white/90 hover:bg-uw/80 disabled:bg-uw/90 disabled:text-white/90 disabled:hover:bg-uw/90 disabled:opacity-100"
        >
            {
                false ? (
                    <LoaderCircleIcon className="animate-spin" />
                ) : (
                    <span>Filter questions</span>
                )
            }
        </Button>
    );

    return (
        <>
            <div className="flex items-center font-bold text-gray-700/90">
                <FilterIcon className="h-4"/>
                <span className="ml-1">Questions Filter</span>
            </div>
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
                    <SheetClose className="w-full">
                        {filterButton}
                    </SheetClose>
                ) : filterButton
            }
        </>
    )
}