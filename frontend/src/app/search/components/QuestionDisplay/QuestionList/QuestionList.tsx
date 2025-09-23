import { getFilteredQuestions } from "@/server/questions";
import Question from "./Question/Question"
import Empty from "@/components/Empty";
import { getCurrentUser } from "@/server/auth";
import { getQuestionCompleted } from "@/server/completed";
import Divider from "@/components/Divider";
import Link from "next/link";
import { getProfile } from "@/server/profile";
import { FileSearchIcon } from "lucide-react";
import Button from "@/components/Button";

type QuestionListProps = {
    questionFilter: QuestionFilter,
    page: number
}

export default async function QuestionList({ questionFilter, page }: QuestionListProps) {
    const questions = await getFilteredQuestions(questionFilter, page);

    if (questions.length === 0) {
        const profile = await getProfile();

        return (
            <Empty
                imgSrc="/dubs-sad.png"
                imgAlt="Dubs is sad that no questions were found."
                primaryText="Sorry, no questions found"
                secondaryText="Update your filters and try again"
            >
                <Divider text="or" className="my-3" />
                <Button
                    href={`/search?class=${profile?.class.replace(" ", "+") || ""}&exam=&topics=`}
                    className="w-min"
                >
                    <FileSearchIcon className="h-5"/>
                    <span className="ml-2 whitespace-nowrap">Browse All {profile?.class} Questions</span>
                </Button>
            </Empty>
        );
    }

    const user = await getCurrentUser();

    return questions.map(async (question, i) => (
        <Question
            key={`question_${i}`}
            question={question}
            user={user}
            completed={await getQuestionCompleted(question.testId, question.number)}
        />
    ));
}