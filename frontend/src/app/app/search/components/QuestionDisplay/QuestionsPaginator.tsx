"use client";

import { useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type QuestionsPaginatorProps = {
    page: number,
    totalPagesCount: number,
    siblingCount?: number,
    pageQuestionsCount: number,
    totalQuestionsCount: number
};

export default function QuestionsPaginator({ page, pageQuestionsCount, totalQuestionsCount, totalPagesCount, siblingCount = 1 }: QuestionsPaginatorProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const clamp = (n: number) => Math.min(Math.max(n, 1), Math.max(totalPagesCount, 1));

    const buildHref = (targetPage: number) => {
        const p = new URLSearchParams(searchParams.toString());
        p.set("page", String(clamp(targetPage)));
        return `${pathname}?${p.toString()}`;
    };

    const items = useMemo(() => {
        const current = clamp(page);
        const total = Math.max(totalPagesCount, 1);
        const start = Math.max(2, current - siblingCount);
        const end = Math.min(total - 1, current + siblingCount);

        const pages: (number | "...")[] = [1];

        if (start > 2) pages.push("...");
        for (let i = start; i <= end; i++) pages.push(i);
        if (end < total - 1) pages.push("...");
        if (total > 1) pages.push(total);

        return Array.from(new Set(pages));
    }, [page, totalPagesCount, siblingCount]);

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
                        <div className="font-semibold h-full text-gray-600/90 text-center p-1">
                            {item}
                        </div>
                    ) : (
                        <QuestionsPaginatorLink
                            key={i}
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
        <Button
            asChild
            disabled={!!href || active}
            className={
                "font-bold rounded-full shadow-none h-8 w-8 " +
                (active ? "bg-uw/90 text-white/90 hover:bg-uw/90" : "bg-transparent text-gray-500/90 hover:text-uw/90 hover:bg-purple-100/90")
            }
        >
            <Link
                href={href || ""}
            >
                {children}
            </Link>
        </Button>
    )
}