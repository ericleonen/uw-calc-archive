import { Skeleton } from "@/components/ui/skeleton";

export default function QuestionDisplayLoader() {
    return (
        <div className="w-full space-y-6 my-6">
            {
                Array.from(Array(5)).map((_, i) => (
                    <Skeleton key={i} className="w-full rounded-md h-32"/>
                ))
            }
        </div>
    )
}