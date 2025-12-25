"use client"

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { FilterIcon } from "lucide-react";
import TestFilterForm from "./TestFilterForm";
import { useState } from "react";

type MobileTestFiltersProps = {
    profileClass?: string
}

export default function MobileTestFilters({ profileClass }: MobileTestFiltersProps) {
    const [sheetOpen, setSheetOpen] = useState(false);

    return (
        <Sheet open={sheetOpen}>
            <button 
                onClick={() => setSheetOpen(true)}
                className="absolute block p-3 rounded-full shadow lg:hidden bottom-3 right-3 bg-uw aspect-square hover:bg-uw-light hover:cursor-pointer"
            >
                <FilterIcon className="text-lg text-white/90"/>
            </button>
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
                    <TestFilterForm 
                        closeSheet={() => setSheetOpen(false)} 
                        initialClass={profileClass || undefined}
                    />
                </div>
            </SheetContent>
        </Sheet>
    )
}