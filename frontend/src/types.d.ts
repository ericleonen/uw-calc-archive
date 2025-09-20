type QuestionFilter = {
    class?: string,
    exam?: string,
    topics?: string[]
}

type Question = {
    number: number,
    questionImgSrc: string,
    answerImgSrc: string,
    topics: string[],
    testId: string,
    quarter: string,
    class: string,
    exam: string
}

type PagedData<T> = {
    data: T,
    page: number,
    totalItemsCount: number,
    totalPagesCount: number
}