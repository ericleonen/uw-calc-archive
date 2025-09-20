import SideBar from "./components/SideBar";
import QuestionDisplay from "./components/QuestionDisplay";
import MobileQuestionFilters from "./components/MobileQuestionFilters";

export default async function SearchPage({
    params,
    searchParams,
}: {
    params: Promise<{ slug: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const sp = await searchParams;

    console.log(sp);

    return (
        <>
            <SideBar />
            <QuestionDisplay />
            <MobileQuestionFilters />
        </>
    )
}