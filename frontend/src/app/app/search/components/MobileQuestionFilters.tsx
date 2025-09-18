import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { FilterIcon } from "lucide-react"
import QuestionFilterForm from "./QuestionFilterForm/QuestionFilterForm"


export default function MobileQuestionFilters() {
    return (
        <Sheet>
            <SheetTrigger className="absolute block p-3 rounded-full shadow lg:hidden bottom-3 right-3 bg-uw/90 aspect-square hover:bg-uw/80 hover:cursor-pointer">
                <FilterIcon className="text-lg text-white/90"/>
            </SheetTrigger>
            <SheetContent
                side="top"
                className="flex items-center p-6 bg-white"
            >
                <div className="flex flex-col w-full max-w-96">
                    <QuestionFilterForm sheetClose />
                </div>
            </SheetContent>
        </Sheet>
    )
}