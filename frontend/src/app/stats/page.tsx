import MobileTestFilters from "./components/MobileTestFilters";
import SideBar from "./components/SideBar";
import StatsDisplay from "./components/StatsDisplay";

export default async function StatsPage({
    searchParams,
}: {
    searchParams: Promise<{ class?: string, exam?: string }>
}) {
    const sp = await searchParams;

    return (
        <>
            <SideBar />
            <StatsDisplay class_={sp.class} exam={sp.exam} />
            <MobileTestFilters />
        </>
    )
}