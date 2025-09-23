import { Suspense } from "react";
import QuestionList from "./QuestionList";
import QuestionsPaginator from "./QuestionsPaginator";
import QuestionsPaginatorSkeleton from "./QuestionsPaginator/QuestionsPaginatorSkeleton";
import QuestionListSkeleton from "./QuestionList/QuestionListSkeleton";
import Empty from "@/components/Empty";
import Divider from "@/components/Divider";
import { getProfile } from "@/server/profile";
import Link from "next/link";
import { FileSearchIcon } from "lucide-react";

type QuestionDisplayProps = {
    questionFilter: QuestionFilter | null,
    page: number
}

export default async function QuestionDisplay({ questionFilter, page }: QuestionDisplayProps) {
    if (!questionFilter) {
        const profile = await getProfile();

        return (
            <Empty
                imgSrc="/dubs-happy.png"
                imgAlt="Dubs is happy to start practicing questions!"
                primaryText="Ready to start practicing?"
                secondaryText="Select your class, exam, and topics in the left sidebar to find test questions to practice"
                secondaryMobileText="Filter questions by class, exam, and topics with the lower right filter button"
            >
                <Divider text="or" className="my-3" />
                <Link
                    href={`/search?class=${profile?.class.replace(" ", "+") || ""}&exam=&topics=`}
                    className="flex items-center px-2 py-1 font-semibold rounded-md bg-uw text-white/90 hover:bg-uw-light"
                >
                    <FileSearchIcon className="h-5"/>
                    <span className="ml-2">Browse All {profile?.class} Questions</span>
                </Link>
            </Empty>
        );
    }

    const questionFilterStr = JSON.stringify(questionFilter);

    return (
        <div className="flex justify-center h-full p-3 overflow-y-scroll grow">
            <div className="flex flex-col items-center w-full max-w-2xl space-y-3 h-min">
                <Suspense
                    key={questionFilterStr}
                    fallback={<QuestionsPaginatorSkeleton />}
                >
                    <QuestionsPaginator questionFilter={questionFilter} page={page} />
                </Suspense>
                <Suspense
                    key={questionFilterStr + " page-" + page}
                    fallback={<QuestionListSkeleton />}
                >
                    <QuestionList questionFilter={questionFilter} page={page} />
                </Suspense>
            </div>
        </div>
    )
}