import Empty from "@/components/Empty";
import Emphasis from "@/components/text/Emphasis";
import Paragraph from "@/components/text/Paragraph";
import SectionHeader from "@/components/text/SectionHeader";
import { getStats } from "@/server/stats";

type StatsDisplayProps = {
    class_?: string,
    exam?: string
}

export default async function StatsDisplay({ class_, exam }: StatsDisplayProps) {
    if (!class_ || !exam) return (
        <Empty
            imgSrc="/dubs-thinking.png"
            imgAlt="Dubs is wondering what to study"
            primaryText="Wonder what's on your test?"
            secondaryText="Select your class and exam in the left sidebar to research what topics to study"
            secondaryMobileText="Hit the lower right filter button to select class and exam to research what topics to study"
        />
    );

    const topicCoverageStats = await getStats(class_, exam);

    const asProbability = (testsWithTopicCount: number, totalTestsCount: number) => {
        if (totalTestsCount === 0) return "0%";
        
        return Math.round(testsWithTopicCount / totalTestsCount * 100) + "%";
    }

    return (
        <div className="flex justify-center h-full p-6 overflow-y-scroll grow">
            <div className="flex flex-col items-center w-full max-w-2xl space-y-3 h-min">
                <div className="flex flex-col w-full p-6 rounded-md shadow bg-white/90">
                    <SectionHeader>What's going to be on my {class_} {exam}?</SectionHeader>
                    <Paragraph className="mt-2 mb-3">
                        A breakdown of what's going to be on your next exam. <Emphasis>Test Coverage</Emphasis> is the probability of a topic being on your next exam. <Emphasis>Question Coverage</Emphasis> is the probability of a question testing you on a topic. These probabilities assume the archived tests and questions are a representative sample of tests in general.
                    </Paragraph>
                    <table>
                        <thead>
                            <tr>
                                <TableHead>Topic</TableHead>
                                <TableHead>Test Coverage</TableHead>
                                <TableHead>Question Coverage</TableHead>
                            </tr>
                        </thead>
                        <tbody>{
                            topicCoverageStats.topics.map((topicStats: any) => {
                                const testProb = asProbability(topicStats.testsWithTopicCount, topicCoverageStats.totalTestsCount);
                                const questionProb = asProbability(topicStats.questionsWithTopicCount, topicCoverageStats.totalQuestionsCount);

                                return (
                                    <tr key={topicStats.topic}>
                                        <TableData>{topicStats.topic}</TableData>
                                        <TableData>
                                            {testProb}
                                            <ProbabilityBar probability={testProb} />
                                        </TableData>
                                        <TableData>
                                            {questionProb}
                                            <ProbabilityBar probability={questionProb} />
                                        </TableData>
                                    </tr>
                                )
                            })
                        }</tbody>
                    </table>
                    <Paragraph className="mt-3 text-sm">
                        <Emphasis variant="secondary">Source:</Emphasis> {topicCoverageStats.totalTestsCount} tests ({topicCoverageStats.totalQuestionsCount} questions) scraped from {class_} {exam} archives.
                    </Paragraph>
                </div>
            </div>
        </div>
    );
}

type TableProps = {
    children: React.ReactNode
}

function TableHead({ children }: TableProps) {
    return (
        <th className="bg-purple-100 text-uw/90 font-semibold px-2 py-1 text-left border-2 border-violet-300">{children}</th>
    )
}

function TableData({ children }: TableProps) {
    return (
        <th className="text-gray-500/90 font-medium px-2 py-1 text-left border-2 border-gray-300">{children}</th>
    )
}

type ProbabilityBarProps = {
    probability: string
}

function ProbabilityBar({ probability }: ProbabilityBarProps) {
    return (
        <div className="w-full bg-gray-300 rounded-full h-2 overflow-hidden">
            <div
                className="bg-uw-light h-full"
                style={{ width: probability }}
            />
        </div>
    )
}