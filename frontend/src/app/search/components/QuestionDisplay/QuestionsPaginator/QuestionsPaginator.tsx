import { ChevronLeft, ChevronRight } from "lucide-react";
import { getFilteredQuestionsPaginatorMetadata } from "@/server/questions";
import QuestionsPaginatorLink from "./QuestionsPaginatorLink";

type QuestionsPaginatorProps = {
    questionFilter: QuestionFilter,
    page: number
};

export default async function QuestionsPaginator({ questionFilter, page }: QuestionsPaginatorProps) {
    const { totalItemsCount, totalPagesCount, pageSize, lastPageSize } = await getFilteredQuestionsPaginatorMetadata(questionFilter);

    if (totalItemsCount === 0) return null;

    const items: (number | "...")[] = [];
    if (totalPagesCount <= 7) {
        for (let i = 1; i <= totalPagesCount; i++) items.push(i);
    } else {
        if (page <= 4) {
            for (let i = 1; i <= 5; i++) items.push(i);
            items.push("...");
            items.push(totalPagesCount);
        } else if (page >= totalPagesCount - 4) {
            items.push(1);
            items.push("...");
            for (let i = totalPagesCount - 4; i <= totalPagesCount; i++) items.push(i);
        } else {
            items.push(1);
            items.push("...");
            for (let i = page - 1; i <= page + 1; i++) items.push(i);
            items.push("...");
            items.push(totalPagesCount);
        }
    }

    return (
        <div className="flex items-center justify-center p-2 space-x-1 rounded-md shadow bg-white/90">
            <QuestionsPaginatorLink
                toPage={page - 1}
                disabled={page === 1}
            >
                <ChevronLeft />
            </QuestionsPaginatorLink>
            {
                items.map((item, i) => 
                    item === "..." ? (
                        <div
                            key={`ellipsis_${i}`}
                            className="w-8 h-8 p-1 font-semibold text-center text-gray-600/90"
                        >
                            {item}
                        </div>
                    ) : (
                        <QuestionsPaginatorLink
                            key={`page_${i}`}
                            toPage={item}
                            active={page === item}
                        >
                            {item}
                        </QuestionsPaginatorLink>
                    )
                )
            }
            <QuestionsPaginatorLink
                toPage={page + 1}
                disabled={page === totalPagesCount}
            >
                <ChevronRight />
            </QuestionsPaginatorLink>
            <p className="hidden ml-2 mr-4 text-sm font-semibold text-gray-600/90 sm:block">
                Showing {page === totalPagesCount ? lastPageSize : pageSize} of {totalItemsCount} results
            </p>
        </div>
    );
}