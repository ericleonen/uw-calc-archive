import List from "@/components/text/List"
import Paragraph from "@/components/text/Paragraph"
import SectionHeader from "@/components/text/SectionHeader"

export default function AboutPage() {
    return (
        <div className="flex justify-center w-full p-6 overflow-y-scroll grow lg:py-16">
            <div className="w-full max-w-lg space-y-6 h-min">
                <div className="space-y-2">
                    <SectionHeader>What is this?</SectionHeader>
                    <Paragraph>UW CalcArchive solves two of the biggest problems MATH 124/5/6 students face preparing for midterms and finals:</Paragraph>
                    <List variant="unordered">
                        <Paragraph>Not knowing what topics are most important</Paragraph>
                        <Paragraph>Not being able to focus practice testing on topics they're struggling with</Paragraph>
                    </List>
                    <Paragraph>You <i>could</i> spend hours taking practice test after practice test—if you have nothing better to do (me as a freshman). OR, you could use UW CalcArchive.</Paragraph>
                </div>
                <div className="space-y-2">
                    <SectionHeader>How to use this</SectionHeader>
                    <Paragraph>I made this website with the intention of the following workflow:</Paragraph>
                    <List>
                        <Paragraph>Use the "Stats" page to understand what's likely to be on your next test</Paragraph>
                        <Paragraph>Do 1-2 practice tests from the archive to see which topics you're making mistakes on</Paragraph>
                        <Paragraph>Use UW CalcArchive to block-practice topics you struggle with</Paragraph>
                        <Paragraph>Ace the test</Paragraph>
                    </List>
                </div>
                <div className="space-y-2">
                    <SectionHeader>The dream</SectionHeader>
                    <Paragraph>For you, I want you to be a part of the elite 4.0 club of introductory calculus. At the very least, I want to extinguish the notion of this series being a "weed-out" class.</Paragraph>
                    <Paragraph>For me, I wanted to create something people would actually use. If you find this website useful, please share it with everyone you know.</Paragraph>
                </div>
            </div>
        </div>
    )
}