import { LoaderCircleIcon } from "lucide-react";

export default function QuestionDisplayLoader() {
    return (
        <div className="flex flex-col items-center justify-center h-full w-full text-gray-500/90">
            <LoaderCircleIcon className="animate-spin" />
            <span className="mt-2 font-semibold">Loading questions</span>
        </div>
    )
}