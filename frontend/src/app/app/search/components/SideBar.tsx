"use client"

import { useState } from "react";
import SearchSelect from "./SearchSelect";
import SearchMultiSelect from "./SearchMultiSelect";

export default function SideBar() {
    const [class_, setClass] = useState("");
    const [exam, setExam] = useState("");
    const [difficulties, setDifficulties] = useState<string[]>(["Easy", "Medium", "Hard"]);
    const [topics, setTopics] = useState<string[]>([]);

    return (
        <div className="flex flex-col w-96 h-full p-6 bg-white/90">
            <p className="font-bold text-gray-700/90">Questions Filter</p>
            <div className="mt-6 space-y-3">
                <SearchSelect 
                    label="Class"
                    placeholder="Select your class"
                    options={["MATH 124", "MATH 125", "MATH 126"]}
                    value={class_}
                    setValue={setClass}
                />
                <SearchSelect 
                    label="Exam"
                    placeholder="Select your exam"
                    options={["Midterm 1", "Midterm 2", "Final"]}
                    value={exam}
                    setValue={setExam}
                />
                <SearchMultiSelect
                    label="Difficulties"
                    placeholder="Select difficulties"
                    options={["Easy", "Medium", "Hard"]}
                    values={difficulties}
                    setValues={setDifficulties}
                />
                <SearchMultiSelect
                    label="Topics"
                    placeholder="Select topics"
                    options={[
                        "Vector Operations",
                        "3D Lines/Planes",
                        "Quadric/Conic Surfaces",
                        "Parameterized Curves",
                        "Arc Length",
                        "Curvature",
                        "Tangent/Normal/Binormal Vectors",
                        "Polar Coordinates",
                        "Polar Curves",
                        "Two-Variable Functions",
                        "Partial Derivatives",
                        "Tangent Planes",
                        "Linear Approximations",
                        "Gradients",
                        "Critical Points",
                        "Optimization",
                        "Multivariable Riemann Sums",
                        "Iterated Integrals",
                        "Polar Form Integrals",
                        "Center of Mass",
                        "Taylor Polynomials",
                        "Taylor Series",
                        "Convergence Tests",
                        "Taylor Series Manipulations"
                    ]}
                    values={topics}
                    setValues={setTopics}
                />
            </div>

        </div>
    )
}