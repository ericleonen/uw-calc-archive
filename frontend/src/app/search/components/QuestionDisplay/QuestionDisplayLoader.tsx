import { Skeleton } from "@/components/ui/skeleton";

type QuestionDisplayLoaderProps = {
    withPaginator?: boolean
}

export default function QuestionDisplayLoader({ withPaginator = false }: QuestionDisplayLoaderProps) {
    return (
        <>
            {
                withPaginator && <Skeleton className="rounded-md h-12 w-full max-w-64"/>
            }
            {
                Array.from(Array(5)).map((_, i) => (
                    <Skeleton key={i} className="w-full rounded-md h-32"/>
                ))
            }
        </>
    )
}