"use client";

import { useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

type QuestionsPaginatorProps = {
    page: number,
    totalPagesCount: number,
    pageQuestionsCount: number,
    totalQuestionsCount: number
};

export default function QuestionsPaginator({ page, pageQuestionsCount, totalQuestionsCount, totalPagesCount }: QuestionsPaginatorProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const clamp = (n: number) => Math.min(Math.max(n, 1), Math.max(totalPagesCount, 1));

    const buildHref = (targetPage: number) => {
        const p = new URLSearchParams(searchParams.toString());
        p.set("page", String(clamp(targetPage)));
        return `${pathname}?${p.toString()}`;
    };

    const items = useMemo(() => {
        const pages: (number | "...")[] = [];

        if (totalPagesCount <= 7) {
            for (let i = 1; i <= totalPagesCount; i++) pages.push(i);
        } else {
            if (page <= 4) {
                for (let i = 1; i <= 5; i++) pages.push(i);
                pages.push("...");
                pages.push(totalPagesCount);
            } else if (page >= totalPagesCount - 4) {
                pages.push(1);
                pages.push("...");
                for (let i = totalPagesCount - 4; i <= totalPagesCount; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push("...");
                for (let i = page - 1; i <= page + 1; i++) pages.push(i);
                pages.push("...");
                pages.push(totalPagesCount);
            }
        }

        return pages;
    }, [page, totalPagesCount]);

    const prevDisabled = page <= 1;
    const nextDisabled = page >= totalPagesCount;

    return (
        <div className="bg-white/90 rounded-md p-2 flex space-x-1 shadow items-center justify-center">
            <QuestionsPaginatorLink href={prevDisabled ? undefined : buildHref(page - 1)}>
                <ChevronLeft />
            </QuestionsPaginatorLink>
            {
                items.map((item, i) => 
                    item === "..." ? (
                        <div
                            key={`ellipsis_${i}`}
                            className="font-semibold h-8 w-8 text-gray-600/90 text-center p-1"
                        >
                            {item}
                        </div>
                    ) : (
                        <QuestionsPaginatorLink
                            key={`page_${i}`}
                            href={buildHref(item)}
                            active={page === item}
                        >
                            {item}
                        </QuestionsPaginatorLink>
                    )
                )
            }
            <QuestionsPaginatorLink href={nextDisabled ? undefined : buildHref(page + 1)}>
                <ChevronRight />
            </QuestionsPaginatorLink>
            <p className="text-sm text-gray-600/90 font-semibold ml-2 mr-4 hidden sm:block">Showing {pageQuestionsCount} of {totalQuestionsCount} results</p>
        </div>
    );
}

type QuestionsPaginatorLinkProps = {
    href?: string,
    active?: boolean,
    children: React.ReactNode
}

function QuestionsPaginatorLink({ href, active, children }: QuestionsPaginatorLinkProps) {
    return (
        <Link
            href={href || ""}
            className={
                "font-bold rounded-full shadow-none h-8 w-8 flex items-center justify-center text-sm " +
                (active ? "bg-uw/90 text-white/90 hover:bg-uw/90" : "bg-transparent text-gray-500/90 hover:text-uw/90 hover:bg-purple-100/90") +
                ((!href || active) ? " pointer-events-none" : " pointer-events-auto")
            }
        >
            {children}
        </Link>
    )
}