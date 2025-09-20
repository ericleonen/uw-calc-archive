import SideBar from "./components/SideBar";
import QuestionDisplay from "./components/QuestionDisplay";
import MobileQuestionFilters from "./components/MobileQuestionFilters";

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const sp = await searchParams || {};

    let questionFilter: QuestionFilter | null = null;

    if (sp.class !== undefined && sp.exam !== undefined && sp.topics !== undefined) {
        questionFilter = {
            class: typeof sp.class === "string" ? sp.class : undefined,
            exam: typeof sp.exam === "string" ? sp.exam : undefined,
            topics: typeof sp.topics === "string" && sp.topics.includes(",") ? sp.topics.split(",") : undefined
        };
    }

    const page = typeof sp.page === "string" ? parseInt(sp.page) : 1;

    return (
        <>
            <SideBar />
            <QuestionDisplay questionFilter={questionFilter} page={page} />
            <MobileQuestionFilters />
        </>
    )
}