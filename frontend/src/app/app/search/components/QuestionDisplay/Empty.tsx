import { DicesIcon, TextSearchIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type EmptyProps = {
    noQuery?: boolean
}

export default function Empty({ noQuery = false }) {
    return (
        <div className="flex flex-col items-center py-16 px-4 text-center">
            <div className="mx-auto mb-2 h-40 w-40">
                <Image src="/dubs-happy.png" alt="No questions yet" width={160} height={160} />
            </div>
            <h2 className="text-2xl font-bold text-uw/90">{
                noQuery ? "Ready to search the UW CalcArchive?" : "Sorry, no questions found!"
            }</h2>
            <p className="mt-1 text-gray-500/90 font-medium lg:hidden">{
                noQuery ? "Click the filter button in the bottom right and choose your class, exam, and topics" : "Try a different query"
            }</p>
            <p className="mt-1 text-gray-500/90 font-medium hidden lg:block">{
                noQuery ? "Choose your class, exam, and topics in the left sidebar" : "Try a different query"
            }</p>
            <div className="relative w-full bg-gray-300/90 h-[2px] my-6">
                <p className="font-bold text-gray-400/90 bg-gray-200 px-2 w-min absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]">OR</p>
            </div>
            <Link
                href="/app/search?class=&exam=&topics="
                className="bg-uw/90 text-white/90 px-2 py-1 rounded-md flex items-center hover:bg-uw/70 font-medium"
            >
                <TextSearchIcon className="h-5"/>
                <span className="ml-2">Browse All Questions</span>
            </Link>
        </div>
    )
}