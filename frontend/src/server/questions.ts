import { createClient } from "@/utils/supabase/server"
import { cache } from "react"

const PAGE_SIZE = 5

export const getFilteredQuestionsPaginatorMetadata = cache(async function (
    questionFilter: QuestionFilter
): Promise<PaginatorMetadata> {
    const supabase = await createClient();
    
    let query = supabase
        .from("questions")
        .select(`test_id, tests!inner(id)`, { count: "exact", head: true })

    if (questionFilter.class) {
        query = query.eq("tests.class", questionFilter.class)
    }
    if (questionFilter.exam) {
        query = query.eq("tests.exam", questionFilter.exam)
    }
    if (questionFilter.topics && questionFilter.topics.length) {
        query = query.overlaps("topics", questionFilter.topics)
    }

    let { count, error } = await query;
    if (error) throw error;

    count = count || 0;

    return {
        totalItemsCount: count,
        totalPagesCount: Math.max(1, Math.ceil(count / PAGE_SIZE)),
        pageSize: PAGE_SIZE,
        lastPageSize: count % PAGE_SIZE || PAGE_SIZE
    }
})

export const getFilteredQuestions = cache(async function (
    questionFilter: QuestionFilter,
    page: number
): Promise<Question[]> {
    const supabase = await createClient()
    const from = Math.max(0, (page - 1) * PAGE_SIZE)
    const to = from + PAGE_SIZE - 1

    let query = supabase
        .from("ordered_questions")
        .select(`
            test_id,
            number,
            topics,
            tests!inner (
                id,
                class,
                exam,
                quarter,
                year
            )
        `)

    if (questionFilter.class) {
        query = query.eq("tests.class", questionFilter.class)
    }
    if (questionFilter.exam) {
        query = query.eq("tests.exam", questionFilter.exam)
    }
    if (questionFilter.topics && questionFilter.topics.length) {
        query = query.overlaps("topics", questionFilter.topics)
    }

    const { data, error } = await query.range(from, to)

    if (error) throw error

    const items: Question[] =
        (data ?? []).map((q: any) => {
            const t = q.tests;
            return {
                testId: q.test_id,
                number: q.number,
                topics: q.topics,
                questionImgSrc: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/archive/${q.test_id}/Q${q.number}/question.png`,
                answerImgSrc: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/archive/${q.test_id}/Q${q.number}/answer.png`,
                class: t.class,
                quarter: t.quarter + " " + t.year,
                exam: t.exam
            }
        })

    return items;
});