import Divider from "@/components/Divider";
import { DicesIcon, TextSearchIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type EmptyProps = {
    noQuery?: boolean
}

export default function Empty({ noQuery = false }) {
    return (
        <div className="flex flex-col items-center px-4 py-16 text-center">
            <div className="w-40 h-40 mx-auto mb-2">
                <Image src="/dubs-happy.png" alt="No questions yet" width={160} height={160} />
            </div>
            <h2 className="text-2xl font-bold text-uw/90">{
                noQuery ? "Ready to search the archive?" : "Sorry, no questions found!"
            }</h2>
            <p className="mt-1 font-medium text-gray-500/90 lg:hidden">{
                noQuery ? "Click the filter button in the bottom right and choose your class, exam, and topics" : "Try a different query"
            }</p>
            <p className="hidden mt-1 font-medium text-gray-500/90 lg:block">{
                noQuery ? "Choose your class, exam, and topics to filter questions" : "Try different filters"
            }</p>
            <Divider text="or" className="my-3" />
            <Link
                href="/search?class=&exam=&topics="
                className="flex items-center px-2 py-1 font-medium rounded-md bg-uw text-white/90 hover:bg-uw-light"
            >
                <TextSearchIcon className="h-5"/>
                <span className="ml-2">Browse All Questions</span>
            </Link>
        </div>
    )
}