import { useAtom, useAtomValue } from "jotai";
import { CLASSES, TEST_TYPES, TOPICS } from "../../constants";
import SelectInput from "./SelectInput";
import { classAtom, testTypeAtom, topicsAtom } from "@/app/atoms/questionFilter";
import MultiSelectInput from "./MultiSelectInput";
import { Button } from "@/components/ui/button";
import { useFilterQuestions } from "@/app/hooks/useFilterQuestions";
import { SheetClose } from "@/components/ui/sheet";
import { FilterIcon, LoaderCircleIcon } from "lucide-react";
import { questionsAreLoadingAtom } from "@/app/atoms/questions";

type QuestionFilterFormProps = {
    sheetClose?: boolean
}

export default function QuestionFilterForm({ sheetClose }: QuestionFilterFormProps) {
    const [class_, setClass] = useAtom(classAtom);
    const [testType, setTestType] = useAtom(testTypeAtom);
    const [topics, setTopics] = useAtom(topicsAtom);

    const questionsAreLoading = useAtomValue(questionsAreLoadingAtom)

    const filterQuestions = useFilterQuestions();

    const filterButton = (
        <Button
            onClick={filterQuestions}
            disabled={questionsAreLoading}
            className="w-full font-semibold disabled:hover:cursor-default hover:cursor-pointer bg-uw/90 text-white/90 hover:bg-uw/80 disabled:bg-uw/90 disabled:text-white/90 disabled:hover:bg-uw/90 disabled:opacity-100"
        >
            {
                questionsAreLoading ? (
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