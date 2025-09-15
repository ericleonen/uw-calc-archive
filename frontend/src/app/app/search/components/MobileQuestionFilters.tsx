import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { FilterIcon } from "lucide-react"
import QuestionFilterForm from "./QuestionFilterForm/QuestionFilterForm"

type MobileQuestionFiltersProps = {
    updateQuestions: () => Promise<void>
}

export default function MobileQuestionFilters({ updateQuestions }: MobileQuestionFiltersProps) {
    return (
        <Sheet>
            <SheetTrigger className="block lg:hidden absolute bottom-2 right-2">
                <FilterIcon />
            </SheetTrigger>
            <SheetContent
                side="bottom"
                className="bg-white/90 p-6 flex items-center"
            >
                <div className="flex flex-col w-full max-w-96">
                    <QuestionFilterForm updateQuestions={updateQuestions}/>
                </div>
            </SheetContent>
        </Sheet>
    )
}