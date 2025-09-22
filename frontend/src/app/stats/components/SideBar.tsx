import TestFilterForm from "./TestFilterForm";

export default function SideBar() {
    return (
        <aside className="lg:flex flex-col w-96 h-full p-6 bg-white/90 hidden">
            <TestFilterForm />
        </aside>
    )
}