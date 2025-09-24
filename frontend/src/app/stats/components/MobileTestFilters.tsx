import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { FilterIcon } from "lucide-react";
import TestFilterForm from "./TestFilterForm";
import { getProfile } from "@/server/profile";

export default async function MobileTestFilters() {
    const profileClass = (await getProfile())?.class;

    return (
        <Sheet>
            <SheetTrigger className="absolute block p-3 rounded-full shadow lg:hidden bottom-3 right-3 bg-uw/90 aspect-square hover:bg-uw/80 hover:cursor-pointer">
                <FilterIcon className="text-lg text-white/90"/>
            </SheetTrigger>
            <SheetContent
                side="top"
                className="flex items-center p-6 bg-white"
            >
                <SheetHeader className="hidden">
                    <SheetTitle>Tests Filter</SheetTitle>
                    <SheetDescription>
                        Select your class and exam.
                    </SheetDescription>
                </SheetHeader>
                <div className="flex flex-col w-full max-w-96">
                    <TestFilterForm sheetClose initialClass={profileClass || undefined} />
                </div>
            </SheetContent>
        </Sheet>
    )
}