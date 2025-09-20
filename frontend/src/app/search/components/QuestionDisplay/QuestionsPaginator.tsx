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
        <div className="flex items-center justify-center p-2 space-x-1 rounded-md shadow bg-white/90">
            <QuestionsPaginatorLink href={prevDisabled ? undefined : buildHref(page - 1)}>
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
            <p className="hidden ml-2 mr-4 text-sm font-semibold text-gray-600/90 sm:block">Showing {pageQuestionsCount} of {totalQuestionsCount} results</p>
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
                (active ? "bg-uw text-white/90 pointer-events-none " : "bg-transparent text-gray-500/90 hover:text-uw hover:bg-purple-100 pointer-events-auto ") +
                (!href ? "pointer-events-none !text-gray-300/90" : "pointer-events-auto")
            }
        >
            {children}
        </Link>
    )
}