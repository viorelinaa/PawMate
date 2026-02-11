import { useMemo, useState } from "react";
import "./quiz.css";
import { useNavigate } from "react-router-dom";

type Answer = {
    text: string;
    value: "dog" | "cat" | "both";
};

type Question = {
    id: string;
    title: string;
    subtitle?: string;
    answers: Answer[];
};

export default function Quiz() {
    const questions: Question[] = useMemo(
        () => [
            {
                id: "q1",
                title: "Cum îți place să-ți petreci timpul liber?",
                subtitle: "Alege varianta care te descrie cel mai bine.",
                answers: [
                    { text: "Afară, plimbări, mișcare", value: "dog" },
                    { text: "Acasă, liniște, confort", value: "cat" },
                    { text: "Depinde de zi, îmi plac ambele", value: "both" },
                ],
            },
            {
                id: "q2",
                title: "Cât timp ai zilnic pentru un animal?",
                answers: [
                    { text: "Mult – pot să ies des cu el", value: "dog" },
                    { text: "Mai puțin – prefer ceva mai independent", value: "cat" },
                    { text: "Mediu – pot și una și alta", value: "both" },
                ],
            },
            {
                id: "q3",
                title: "Ce fel de energie îți place în casă?",
                answers: [
                    { text: "Super energic și jucăuș", value: "dog" },
                    { text: "Calm și cozy", value: "cat" },
                    { text: "Un mix echilibrat", value: "both" },
                ],
            },
            {
                id: "q4",
                title: "Cum reacționezi la vizitatori?",
                answers: [
                    { text: "Îmi place să socializez", value: "dog" },
                    { text: "Prefer să stau mai retras(ă)", value: "cat" },
                    { text: "Depinde de context", value: "both" },
                ],
            },
            {
                id: "q5",
                title: "Ce ți se pare mai important?",
                answers: [
                    { text: "Companie activă & aventuri", value: "dog" },
                    { text: "Relaxare & afecțiune liniștită", value: "cat" },
                    { text: "Vreau un prieten echilibrat", value: "both" },
                ],
            },
        ],
        []
    );

    const [step, setStep] = useState(0);
    const [score, setScore] = useState({ dog: 0, cat: 0, both: 0 });

    const current = questions[step];
    const isDone = step >= questions.length;

    function pick(value: Answer["value"]) {
        setScore((s) => ({ ...s, [value]: s[value] + 1 }));
        setStep((x) => x + 1);
    }

    function restart() {
        setStep(0);
        setScore({ dog: 0, cat: 0, both: 0 });
    }

    const result = useMemo(() => {
        // Transformăm "both" în puncte către ambele, ca să nu iasă ciudat
        const dog = score.dog + Math.floor(score.both / 2);
        const cat = score.cat + Math.ceil(score.both / 2);

        if (dog > cat + 1) return "dog";
        if (cat > dog + 1) return "cat";
        return "both";
    }, [score]);

    return (
        <div className="quizPage">
            <div className="quizShell">
                <header className="quizHeader">
                    <div className="quizBadge">Quiz</div>
                    <h1>Ce animal ți se potrivește?</h1>
                    <p>Răspunde la câteva întrebări și vezi recomandarea.</p>
                </header>

                {!isDone ? (
                    <section className="quizCard">
                        <div className="quizProgress">
                            <div className="quizProgressTop">
                <span>
                  Întrebarea <b>{step + 1}</b> din <b>{questions.length}</b>
                </span>
                                <span className="quizProgressPct">
                  {Math.round(((step + 1) / questions.length) * 100)}%
                </span>
                            </div>
                            <div className="quizProgressBar">
                                <div
                                    className="quizProgressFill"
                                    style={{ width: `${((step + 1) / questions.length) * 100}%` }}
                                />
                            </div>
                        </div>

                        <div className="quizQ">
                            <h2>{current.title}</h2>
                            {current.subtitle ? <p>{current.subtitle}</p> : null}
                        </div>

                        <div className="quizAnswers">
                            {current.answers.map((a) => (
                                <button key={a.text} className="quizAnswer" onClick={() => pick(a.value)}>
                                    {a.text}
                                </button>
                            ))}
                        </div>

                        <div className="quizHint">
                            Tip: răspunde instinctiv — nu există răspuns greșit 😊
                        </div>
                    </section>
                ) : (
                    <section className="quizResult">
                        <div className="quizCard quizResultCard">
                            <h2>Rezultat</h2>

                            {result === "dog" && (
                                <>
                                    <div className="quizResultTitle">🐶 Ți se potrivește un câine!</div>
                                    <p className="quizResultText">
                                        Îți place energia, plimbările și compania activă. Un câine ar fi un
                                        prieten super pentru tine.
                                    </p>
                                </>
                            )}

                            {result === "cat" && (
                                <>
                                    <div className="quizResultTitle">🐱 Ți se potrivește o pisică!</div>
                                    <p className="quizResultText">
                                        Îți place liniștea, confortul și o companie mai independentă. O pisică
                                        ar fi perfectă.
                                    </p>
                                </>
                            )}

                            {result === "both" && (
                                <>
                                    <div className="quizResultTitle">🐾 Ți se potrivește un mix!</div>
                                    <p className="quizResultText">
                                        Ești echilibrat(ă): îți plac și momentele active, și cele relaxante.
                                        Te-ai înțelege bine cu ambele.
                                    </p>
                                </>
                            )}

                            <div className="quizStats">
                                <div className="quizStat">
                                    <span>Câine</span>
                                    <b>{score.dog}</b>
                                </div>
                                <div className="quizStat">
                                    <span>Pisică</span>
                                    <b>{score.cat}</b>
                                </div>
                                <div className="quizStat">
                                    <span>Mix</span>
                                    <b>{score.both}</b>
                                </div>
                            </div>

                            <div className="quizActions">
                                <button className="btnPrimary" onClick={restart}>
                                    Reîncepe quiz-ul
                                </button>
                                <a className="btnGhost" href="/">
                                    Înapoi acasă
                                </a>
                            </div>
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
