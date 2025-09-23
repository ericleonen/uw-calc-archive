export default function AboutPage() {
    return (
        <div className="grow w-full flex justify-center py-16 px-3">
            <div className="w-full max-w-md">
                <h2 className="text-lg font-bold text-gray-600/90">What is this?</h2>
                <p>UW CalcArchive solves two of the biggest problems MATH 124/5/6 students face preparing for midterms and finals:</p>
                <ol>
                    <li>Not knowing what topics are most important</li>
                    <li>Not being able to focus practice testing on topics they're struggling with</li>
                </ol>
                <p>You <i>could</i> spend hours taking practice test after practice test—if you have nothing better to do (me as a freshman). OR, you could use UW CalcArchive.</p>
                
                <h2 className="text-lg font-bold text-gray-600/90">How to use this</h2>
                <p>I made this website with the intention of the following workflow:</p>
                <ul>
                    <li>Use the "Stats" page to understand what's likely to be on your next test</li>
                    <li>Do 1-2 practice tests from the archive to see which topics you're making mistakes on</li>
                    <li>Use UW CalcArchive to block-practice topics you struggle with</li>
                    <li>Ace the test</li>
                </ul>

                <h2 className="text-lg font-bold text-gray-600/90">The dream</h2>
                <p>For you, I want you to be a part of the elite 4.0 club of introductory calculus. At the very least, I want to extinguish the notion of this series being a "weed-out" class.</p>
                <p>For me, I wanted to create something people would actually use. If you find this website useful, please share it with everyone you know.</p>
            </div>
        </div>
    )
}