import { Skeleton } from "@/components/ui/skeleton"

export default function QuestionListSkeleton() {
    return Array.from(Array(5)).map((_, i) => (
        <Skeleton key={i} className="w-full h-32 rounded-md"/>
    ));
}