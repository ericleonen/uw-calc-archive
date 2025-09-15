"use client";

import { useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis,
    PaginationLink,
} from "@/components/ui/pagination";

type Props = {
    page: number;
    totalPagesCount: number;
    siblingCount?: number;
};

export default function QuestionsPaginator({ page, totalPagesCount, siblingCount = 1 }: Props) {
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
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious href={prevDisabled ? undefined : buildHref(page - 1)} />
                </PaginationItem>

                {items.map((it, idx) =>
                    it === "..." ? (
                        <PaginationItem key={`ellipsis-${idx}`}>
                            <PaginationEllipsis />
                        </PaginationItem>
                    ) : (
                        <PaginationItem key={it}>
                            <PaginationLink href={buildHref(it)} isActive={it === clamp(page)}>
                                {it}
                            </PaginationLink>
                        </PaginationItem>
                    )
                )}

                <PaginationItem>
                    <PaginationNext href={nextDisabled ? undefined : buildHref(page + 1)} />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
