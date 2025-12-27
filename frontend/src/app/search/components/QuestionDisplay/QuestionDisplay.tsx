import { Suspense } from "react";
import QuestionList from "./QuestionList";
import QuestionsPaginator from "./QuestionsPaginator";
import QuestionsPaginatorSkeleton from "./QuestionsPaginator/QuestionsPaginatorSkeleton";
import QuestionListSkeleton from "./QuestionList/QuestionListSkeleton";
import Empty from "@/components/Empty";
import Divider from "@/components/Divider";
import { getProfile } from "@/server/profile";
import { FileSearchIcon } from "lucide-react";
import Button from "@/components/Button";

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
                secondaryMobileText="Hit the lower right filter button to select your class, exam, and topics to find test questions to practice"
            >
                <Divider text="or" className="my-3" />
                <Button
                    href={`/search?class=${profile?.class?.replace(" ", "+") || ""}&exam=&topics=`}
                    className="w-min"
                >
                    <FileSearchIcon className="h-5"/>
                    <span className="ml-2 whitespace-nowrap">Browse All {profile?.class} Questions</span>
                </Button>
            </Empty>
        );
    }

    const questionFilterStr = JSON.stringify(questionFilter);

    return (
        <div className="flex justify-center h-full p-3 overflow-y-scroll grow">
            <div className="flex flex-col items-center w-full max-w-2xl space-y-3 h-min pb-15">
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
                <Suspense
                    key={questionFilterStr + "_bottom"}
                    fallback={<QuestionsPaginatorSkeleton />}
                >
                    <QuestionsPaginator questionFilter={questionFilter} page={page} isBottom />
                </Suspense>
            </div>
        </div>
    )
}