import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./quiz.css";

type Animal = "dog" | "cat" | "both";

type Answer = {
    text: string;
    value: Animal;
};

type Question = {
    id: string;
    title: string;
    answers: Answer[];
};

const QUESTIONS: Question[] = [
    {
        id: "q1",
        title: "Cum îți petreci cel mai des timpul liber?",
        answers: [
            { text: "Afară, activ(ă), plimbări", value: "dog" },
            { text: "Acasă, liniște, relaxare", value: "cat" },
            { text: "Depinde, îmi place și-și", value: "both" },
        ],
    },
    {
        id: "q2",
        title: "Cât de multă energie ai zilnic?",
        answers: [
            { text: "Multă, îmi place mișcarea", value: "dog" },
            { text: "Mai calm(ă), prefer ritm lent", value: "cat" },
            { text: "Uneori mult, uneori calm", value: "both" },
        ],
    },
    {
        id: "q3",
        title: "Ce te descrie mai bine?",
        answers: [
            { text: "Sociabil(ă), îmi place compania", value: "dog" },
            { text: "Independent(ă), îmi place spațiul meu", value: "cat" },
            { text: "Un mix între cele două", value: "both" },
        ],
    },
    {
        id: "q4",
        title: "Cât timp poți dedica zilnic unui animal?",
        answers: [
            { text: "Destul, pot ieși la plimbări", value: "dog" },
            { text: "Mai puțin, dar constant", value: "cat" },
            { text: "Pot adapta programul", value: "both" },
        ],
    },
    {
        id: "q5",
        title: "Ce fel de interacțiune îți place?",
        answers: [
            { text: "Joacă multă și activitate", value: "dog" },
            { text: "Afecțiune calmă, în ritmul meu", value: "cat" },
            { text: "Ambele", value: "both" },
        ],
    },
];

function getResult(counts: Record<Animal, number>) {
    const { dog, cat, both } = counts;

    if (dog >= cat && dog >= both) {
        return {
            title: "🐶 Ți se potrivește un câine!",
            text:
                "Îți place energia, plimbările și compania activă. Un câine ar fi un prieten super pentru tine.",
            key: "dog" as const,
        };
    }

    if (cat >= dog && cat >= both) {
        return {
            title: "🐱 Ți se potrivește o pisică!",
            text:
                "Îți place liniștea, independența și momentele cozy. O pisică s-ar potrivi perfect cu stilul tău.",
            key: "cat" as const,
        };
    }

    return {
        title: "🐾 Ți se potrivește un mix!",
        text:
            "Ești echilibrat(ă): îți plac și momentele active, și cele relaxante. Te-ai înțelege bine cu ambele.",
        key: "both" as const,
    };
}

export default function Quiz() {
    const [index, setIndex] = useState(0);
    const [counts, setCounts] = useState<Record<Animal, number>>({
        dog: 0,
        cat: 0,
        both: 0,
    });

    const done = index >= QUESTIONS.length;

    const result = useMemo(() => getResult(counts), [counts]);

    function pick(value: Animal) {
        setCounts((prev) => ({ ...prev, [value]: prev[value] + 1 }));
        setIndex((i) => i + 1);
    }

    function restart() {
        setIndex(0);
        setCounts({ dog: 0, cat: 0, both: 0 });
    }

    return (
        <div className="quizPage">
            <div className="quizHero">
                <div className="chip">Quiz</div>
                <h1>Ce animal ți se potrivește?</h1>
                <p>Răspunde la câteva întrebări și vezi recomandarea.</p>
            </div>

            <div className="quizCard">
                {!done ? (
                    <>
                        <div className="quizTop">
                            <div className="quizStep">
                                Întrebarea <b>{index + 1}</b> / {QUESTIONS.length}
                            </div>
                            <button className="linkBtn" onClick={restart} type="button">
                                Reset
                            </button>
                        </div>

                        <h2 className="qTitle">{QUESTIONS[index].title}</h2>

                        <div className="answers">
                            {QUESTIONS[index].answers.map((a) => (
                                <button
                                    key={a.text}
                                    className="answerBtn"
                                    onClick={() => pick(a.value)}
                                    type="button"
                                >
                                    {a.text}
                                </button>
                            ))}
                        </div>
                    </>
                ) : (
                    <>
                        <h2 className="resultTitle">Rezultat</h2>
                        <div className="resultHeadline">{result.title}</div>
                        <p className="resultText">{result.text}</p>

                        <div className="stats">
                            <div className="stat">
                                <div className="statLabel">Câine</div>
                                <div className="statValue">{counts.dog}</div>
                            </div>
                            <div className="stat">
                                <div className="statLabel">Pisică</div>
                                <div className="statValue">{counts.cat}</div>
                            </div>
                            <div className="stat">
                                <div className="statLabel">Mix</div>
                                <div className="statValue">{counts.both}</div>
                            </div>
                        </div>

                        <div className="actions">
                            <button className="primaryBtn" onClick={restart} type="button">
                                Reîncepe quiz-ul
                            </button>

                            <Link className="secondaryBtn" to="/">
                                Înapoi acasă
                            </Link>

                            {/* BUTONUL CERUT */}
                            <Link className="secondaryBtn" to="/adoptie">
                                Mergi la adopție
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
