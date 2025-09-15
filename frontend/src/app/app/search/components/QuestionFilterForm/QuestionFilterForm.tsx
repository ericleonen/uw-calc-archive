import { useAtom } from "jotai";
import { CLASSES, TEST_TYPES, TOPICS } from "../../constants";
import SelectInput from "./SelectInput";
import { classAtom, testTypeAtom, topicsAtom } from "@/app/atoms/questionFilter";
import MultiSelectInput from "./MultiSelectInput";
import { Button } from "@/components/ui/button";

type QuestionFilterFormProps = {
    updateQuestions: () => Promise<void>
}

export default function QuestionFilterForm({ updateQuestions }: QuestionFilterFormProps) {
    const [class_, setClass] = useAtom(classAtom);
    const [testType, setTestType] = useAtom(testTypeAtom);
    const [topics, setTopics] = useAtom(topicsAtom);

    return (
        <>
            <p className="font-bold text-gray-700/90">Questions Filter</p>
            <div className="mt-3 space-y-3">
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
            <Button
                onClick={updateQuestions}
                className="mt-6 bg-uw/90 text-white/90 font-semibold"
            >
                Filter questions
            </Button>
        </>
    )
}