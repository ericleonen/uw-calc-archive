import { NextRequest, NextResponse } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "@/lib/r2";

export const runtime = "nodejs";

type Cache = { data: any; ts: number }
let indexCache: Cache | null = null;
const CACHE_MS = 60_000;

async function fetchIndex(): Promise<any> {
    if (indexCache && Date.now() - indexCache.ts < CACHE_MS) return indexCache.data;

    const Bucket = process.env.R2_BUCKET!;

    const obj = await r2.send(new GetObjectCommand({ Bucket, Key: "archive/index.json" }));
    const text = await (obj.Body as any).transformToString();
    const data = JSON.parse(text);

    indexCache = { data, ts: Date.now() };

    return data;
}

function imgSrc(testId: string, questionNumber: number, isAnswer: boolean = false) {
    return `/api/image?key=archive/${testId}/Q${questionNumber}/${isAnswer ? "answer" : "question"}.png`;
}

function getFilteredQuestions(index: any, questionFilter: QuestionFilter): Question[] {
    const questions: Question[] = [];
    const topicsSet = new Set(questionFilter.topics)

    for (const testMetadata of (Object.values(index) as any[])) {
        const test: Test = {
            id: testMetadata.id,
            type: testMetadata.type,
            class: testMetadata.class,
            quarter: testMetadata.quarter
        }

        if (
            testMetadata.class !== questionFilter.class ||
            testMetadata.type !== questionFilter.testType
        ) {
          continue;
        }

        let questionNumber = 1;
        for (const questionMetadata of testMetadata.questions) {
            if (questionMetadata.topics.some((topic: string) => topicsSet.has(topic))) {
                questions.push({
                    number: questionNumber,
                    topics: questionMetadata.topics,
                    questionImgSrc: imgSrc(testMetadata.id, questionNumber),
                    answerImgSrc: imgSrc(testMetadata.id, questionNumber, true),
                    questionShort: questionMetadata.question_short,
                    answerStrategy: questionMetadata.answer_strategy,
                    test
                });
            }

            questionNumber++;
        }
    }

    return questions;
}

export async function POST(req: NextRequest) {
    const index = await fetchIndex();
    const questionFilter = (await req.json()) as QuestionFilter;

    const questions = getFilteredQuestions(index, questionFilter);
    
    return NextResponse.json(questions);
}