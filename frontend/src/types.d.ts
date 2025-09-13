type QuestionFilter = {
    class: string,
    exam: string,
    topics: string[]
}

type TestIndex = {
    questions: QuestionIndex[],
    exam: string,
    class: string
}

type QuestionIndex = {
    key: string,
    topics: string[]
}

type Question = {
    questionNum: number,
    questionImgSrc: string,
    answerImgSrc: string,
    topics: string[],
    test: {
        id: string,
        quarter: string,
        exam: string,
        class: string
    }
}