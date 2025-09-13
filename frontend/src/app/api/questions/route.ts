import { NextRequest, NextResponse } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "@/lib/r2";

export const runtime = "nodejs";

// type Cache = { data: any; ts: number }
// let indexCache: Cache | null = null;
// const CACHE_MS = 60_000;

async function fetchJSON(key: string) {
    // if (cache && Date.now() - cache.ts < CACHE_MS) return cache.data;

    const Bucket = process.env.R2_BUCKET!;

    const obj = await r2.send(new GetObjectCommand({ Bucket, Key: key }));
    const text = await (obj.Body as any).transformToString();
    const data = JSON.parse(text);

    // cache = { data, ts: Date.now() };

    return data;
}

async function getFilteredQuestions(index: TestIndex[], questionFilter: QuestionFilter) {
    const questions: Question[] = [];
    const topicsSet = new Set(questionFilter.topics)

    for (const testIndex of index) {
        if (
            testIndex.class !== questionFilter.class ||
            testIndex.exam !== questionFilter.exam
        ) {
          continue;
        }

        const testId = testIndex.questions[0].key.split("/")[1]
        const testKey = `archive/${testId}`;
        const testMetadata = await fetchJSON(`${testKey}/metadata.json`);
        
        let questionNum = 1
        for (const questionIndex of testIndex.questions) {
            if (questionIndex.topics.some(topic => topicsSet.has(topic))) {
                const questionKey = questionIndex.key;
                const questionMetadata = await fetchJSON(questionKey + "/metadata.json");

                questions.push({
                    questionNum,
                    questionImgSrc: `/api/image?key=${questionKey}/question.png`,
                    answerImgSrc: `/api/image?key=${questionKey}/answer.png`,
                    topics: questionMetadata.topics,
                    test: {
                        id: testMetadata.id,
                        exam: testMetadata.type,
                        quarter: testMetadata.quarter,
                        class: testMetadata.class
                    }
                });
            }

            questionNum++;
        }
    }

    return questions;
}

export async function POST(req: NextRequest) {
    const index = await fetchJSON("archive/index.json");
    const questionFilter = (await req.json()) as QuestionFilter;

    const questions = await getFilteredQuestions(index, questionFilter);
    
    return NextResponse.json(questions);
}