import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { FilterIcon } from "lucide-react";
import QuestionFilterForm from "./QuestionFilterForm";
import { getProfile } from "@/server/profile";

export default async function MobileQuestionFilters() {
    const profileClass = (await getProfile())?.class;

    return (
        <Sheet>
            <SheetTrigger className="absolute block p-3 rounded-full shadow lg:hidden bottom-3 right-3 bg-uw aspect-square hover:bg-uw-light hover:cursor-pointer">
                <FilterIcon className="text-lg text-white/90"/>
            </SheetTrigger>
            <SheetContent
                side="top"
                className="flex items-center p-6 bg-white"
            >
                <SheetHeader className="hidden">
                    <SheetTitle>Questions Filter</SheetTitle>
                    <SheetDescription>
                        Select your class, exam, and topics to filter questions.
                    </SheetDescription>
                </SheetHeader>
                <div className="flex flex-col w-full max-w-96">
                    <QuestionFilterForm sheetClose initialClass={profileClass || undefined} />
                </div>
            </SheetContent>
        </Sheet>
    )
}