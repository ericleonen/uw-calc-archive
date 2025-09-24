import Hyperlink from "@/components/text/Hyperlink"
import List from "@/components/text/List"
import Paragraph from "@/components/text/Paragraph"
import SectionHeader from "@/components/text/SectionHeader"

export default function AboutPage() {
    return (
        <div className="flex justify-center w-full p-6 overflow-y-scroll grow lg:py-16">
            <div className="w-full max-w-lg space-y-6 h-min">
                <div className="space-y-2">
                    <SectionHeader>What is this?</SectionHeader>
                    <Paragraph>UW CalcArchive is <u>the</u> website to prepare for the University of Washington's introductory calculus series exams. I built it to solve two of the biggest problems MATH 124/5/6 students face preparing for midterms and finals:</Paragraph>
                    <List variant="unordered">
                        <Paragraph>Not knowing what topics are most important</Paragraph>
                        <Paragraph>Not being able to focus practice testing on topics they're struggling with</Paragraph>
                    </List>
                    <Paragraph>You <i>could</i> spend hours taking practice test after practice test—if you have nothing better to do (me as a freshman). Or, you could try UW CalcArchive.</Paragraph>
                </div>
                <div className="space-y-2">
                    <SectionHeader>How to use this</SectionHeader>
                    <Paragraph>I made this website with the intention of the following study process:</Paragraph>
                    <List>
                        <Paragraph>Use <Hyperlink href="/stats">Stats</Hyperlink> to understand what's likely to be on your next test</Paragraph>
                        <Paragraph>Know what topics you're struggling with either through experience or attempting 1-2 practice tests</Paragraph>
                        <Paragraph>Use <Hyperlink href="/search">Question Search</Hyperlink> to find past test questions that allow you to block-practice tricky topics</Paragraph>
                        <Paragraph>Ace the test</Paragraph>
                    </List>
                </div>
                <div className="space-y-2">
                    <SectionHeader>The dream</SectionHeader>
                    <Paragraph>I want MATH 124/5/6 to no longer feel like "weed-out" classes. Or, for motivated students, I wanted to create a way to earn a 4.0 without wasting time.</Paragraph>
                    <Paragraph>As for me, I hope I created something students actually use. If you find this website useful, please share it with everyone you know. 😇</Paragraph>
                </div>
            </div>
        </div>
    )
}