import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import Image from "next/image";
import QuestionsPaginator from "./QuestionsPaginator";

type QuestionListProps = {
    questions: Question[],
    page: number,
    totalPagesCount: number
}

export default function QuestionList({ questions, page, totalPagesCount }: QuestionListProps) {
    return (
        <div className="w-full max-w-2xl space-y-6">
            <QuestionsPaginator page={page} totalPagesCount={totalPagesCount} />
            {
                questions.map(question => (
                    <div
                        key={`${question.test.id}/Q${question.number}`}
                        className="flex flex-col w-full p-3 rounded-md shadow bg-white/90"
                    >
                        <p className="text-sm font-bold text-gray-700/90">Question {question.number} of {question.test.class} {question.test.type}, {question.test.quarter}</p>
                        <Image
                            src={question.questionImgSrc}
                            alt="question"
                            width={512}
                            height={32}
                            className="w-full h-auto p-3 mt-3 bg-white border-2 rounded-sm border-gray-300/90"
                        />
                    </div>
                ))
            }
        </div>
    )
}