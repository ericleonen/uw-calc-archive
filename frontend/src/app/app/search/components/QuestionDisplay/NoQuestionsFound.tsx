import Image from "next/image";

export default function NoQuestionsFound() {
    return (
        <>
            <Image
                src="/no_questions_found.png"
                alt="No questions found"
                height={192}
                width={192}
                className="h-48 w-48 mt-16"
            />
            <p className="text-gray-600/90 font-bold text-lg">No questions found!</p>
        </>
    )
}