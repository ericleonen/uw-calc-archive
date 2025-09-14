type QuestionFilter = {
    class: string,
    testType: string,
    topics: string[]
}

type Index = {
    [testId: string]: Test
}

type Test = {
    id: string,
    type: string,
    class: string,
    quarter: string
}

type Question = {
    number: number,
    questionImgSrc: string,
    answerImgSrc: string,
    topics: string[],
    questionShort: string,
    answerStrategy: string,
    test: Test
}