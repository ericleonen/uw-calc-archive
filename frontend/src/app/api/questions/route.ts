import { NextRequest, NextResponse } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "@/lib/r2";
import { SEASONS } from "@/app/app/search/constants";

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
    const topicsSet = new Set(questionFilter.topics);

    for (const testMetadata of (Object.values(index) as any[])) {
        const test: Test = {
            id: testMetadata.id,
            type: testMetadata.type,
            class: testMetadata.class,
            quarter: testMetadata.quarter
        }

        if (
            (questionFilter.class && testMetadata.class !== questionFilter.class) ||
            (questionFilter.testType && testMetadata.type !== questionFilter.testType)
        ) {
          continue;
        }

        let questionNumber = 1;
        for (const questionMetadata of testMetadata.questions) {
            if (topicsSet.size === 0 || questionMetadata.topics.some((topic: string) => topicsSet.has(topic))) {
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
    const  {questionFilter, page, pageSize } = (await req.json()) as {
        questionFilter: QuestionFilter,
        page: number,
        pageSize: number,
    };

    const questions = getFilteredQuestions(index, questionFilter);
    questions.sort((q1, q2) => {
        const [season1, yearStr1] = q1.test.quarter.split(" ");
        const year1 = parseInt(yearStr1);

        const [season2, yearStr2] = q2.test.quarter.split(" ");
        const year2 = parseInt(yearStr2);

        if (year1 !== year2) {
            return year2 - year1;
        } else if (season1 !== season2) {
            return SEASONS.indexOf(season2) - SEASONS.indexOf(season1);
        } else if (q1.test.id !== q2.test.id) {
            return q2.test.id.localeCompare(q1.test.id);
        } else {
            return q1.number - q2.number;
        }
    });

    const totalQuestionsCount = questions.length;
    const startIndex = (page - 1) * pageSize;

    const questionsSlice = questions.slice(startIndex, startIndex + pageSize)
    
    return NextResponse.json({
        data: questionsSlice,
        totalItemsCount: totalQuestionsCount,
        page,
        totalPagesCount: Math.max(1, Math.ceil(totalQuestionsCount / pageSize))
    });
}