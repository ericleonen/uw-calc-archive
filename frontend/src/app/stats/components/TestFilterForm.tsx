"use client"

import { CLASSES, TEST_TYPES } from "@/constants";
import SelectInput from "@/components/select/SelectInput";
import { useRouter, useSearchParams } from "next/navigation";
import SubmitButton from "@/components/SubmitButton";
import { SheetClose } from "@/components/ui/sheet";

type TestFilterFormProps = {
    sheetClose?: boolean
}

export default function TestFilterForm({ sheetClose = false }: TestFilterFormProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const class_ = searchParams.get("class") || "";
    const exam = searchParams.get("exam") || "";

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const next = new URLSearchParams(searchParams);

        next.set("class", String(formData.get("class")));
        next.set("exam", String(formData.get("exam")));

        router.replace(`?${next.toString()}`, { scroll: false })
    };

    return (
        <form onSubmit={onSubmit}>
            <p className="flex items-center font-bold text-gray-600/90">Test Filter</p>
            <div className="mt-2 mb-6 space-y-2">
                <SelectInput
                    label="class"
                    placeholder="Select your class"
                    options={CLASSES}
                    initialValue={class_}
                />
                <SelectInput
                    label="exam"
                    placeholder="Select your exam"
                    options={TEST_TYPES}
                    initialValue={exam}
                />
            </div>
            {
                sheetClose ? (
                    <SheetClose className="w-full" asChild>
                        <SubmitButton label="Filter tests" />
                    </SheetClose>
                ) : <SubmitButton label="Filter tests" />
            }
        </form>
    )
}