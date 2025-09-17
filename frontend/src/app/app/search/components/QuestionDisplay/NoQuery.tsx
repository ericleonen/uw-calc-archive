import { DicesIcon, TextSearchIcon } from "lucide-react";
import Image from "next/image";

export default function NoQuery() {
    return (
        <div className="mx-auto max-w-3xl py-16 text-center">
            <div className="mx-auto mb-2 h-40 w-40">
                <Image src="/dubs-happy.png" alt="No questions yet" width={160} height={160} />
            </div>
            <h2 className="text-xl font-bold text-uw/90">Ready to search the archive?</h2>
            <p className="mt-1 text-gray-500/90 font-medium">Choose your class, exam, and topics in the left sidebar</p>
            <p className="font-bold text-gray-400/90 my-4">OR</p>
            <div className="flex justify-center gap-3 flex-wrap">
                <button className="bg-uw/90 text-white/90 px-2 py-1 rounded-md flex items-center hover:bg-uw/70" onClick={() => {}}>
                    <TextSearchIcon />
                    <span className="ml-2">Browse All Questions</span>
                </button>
                <button className="flex px-2 py-1 border-2 border-gray-400/90 rounded-md text-gray-500/90 font-semibold items-center hover:bg-gray-300/90" onClick={() => {}}>
                    <DicesIcon />
                    <span className="ml-2">Random Question</span>
                </button>
            </div>
        </div>
    )
}