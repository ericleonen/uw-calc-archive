import { getProfile } from "@/server/profile";
import QuestionFilterForm from "./QuestionFilterForm";

export default async function SideBar() {
    const profileClass = (await getProfile())?.class;

    return (
        <aside className="lg:flex flex-col w-96 h-full p-6 bg-white/90 hidden">
            <QuestionFilterForm initialClass={profileClass || undefined} />
        </aside>
    )
}