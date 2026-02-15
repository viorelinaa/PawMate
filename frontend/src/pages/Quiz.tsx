import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./quiz.css";

type AnimalKey =
    | "dog"
    | "cat"
    | "rabbit"
    | "hamster"
    | "parrot"
    | "turtle"
    | "snake"
    | "lizard";

type Answer = {
    text: string;
    value: AnimalKey;
};

type Question = {
    question: string;
    answers: Answer[];
};

const ANIMALS: Record<
    AnimalKey,
    { name: string; emoji: string; adoptPath: string }
> = {
    dog: { name: "Câine", emoji: "🐶", adoptPath: "/adoptie?animal=dog" },
    cat: { name: "Pisică", emoji: "🐱", adoptPath: "/adoptie?animal=cat" },
    rabbit: { name: "Iepure", emoji: "🐰", adoptPath: "/adoptie?animal=rabbit" },
    hamster: { name: "Hamster", emoji: "🐹", adoptPath: "/adoptie?animal=hamster" },
    parrot: { name: "Papagal", emoji: "🦜", adoptPath: "/adoptie?animal=parrot" },
    turtle: { name: "Broască țestoasă", emoji: "🐢", adoptPath: "/adoptie?animal=turtle" },
    snake: { name: "Șarpe", emoji: "🐍", adoptPath: "/adoptie?animal=snake" },
    lizard: { name: "Șopârlă", emoji: "🦎", adoptPath: "/adoptie?animal=lizard" },
};

const QUESTIONS: Question[] = [
    {
        question: "Cum îți place să îți petreci timpul liber?",
        answers: [
            { text: "Plimbări și activitate", value: "dog" },
            { text: "Relaxare acasă", value: "cat" },
            { text: "Calm și liniște", value: "rabbit" },
            { text: "Observare și curiozitate", value: "turtle" },
        ],
    },
    {
        question: "Cât de mult timp poți acorda zilnic?",
        answers: [
            { text: "Mult timp", value: "dog" },
            { text: "Mediu", value: "cat" },
            { text: "Puțin", value: "hamster" },
            { text: "Foarte puțin", value: "snake" },
        ],
    },
    {
        question: "Ce tip de personalitate ai?",
        answers: [
            { text: "Energic", value: "dog" },
            { text: "Independent", value: "cat" },
            { text: "Blând", value: "rabbit" },
            { text: "Exotic", value: "lizard" },
        ],
    },
    {
        question: "Ce spațiu ai?",
        answers: [
            { text: "Casă cu curte", value: "dog" },
            { text: "Apartament", value: "cat" },
            { text: "Spațiu mic", value: "hamster" },
            { text: "Terariu", value: "snake" },
        ],
    },
    {
        question: "Ce animal te atrage cel mai mult?",
        answers: [
            { text: "Câine", value: "dog" },
            { text: "Pisică", value: "cat" },
            { text: "Papagal", value: "parrot" },
            { text: "Țestoasă", value: "turtle" },
        ],
    },
];

export default function Quiz() {
    const [index, setIndex] = useState(0);
    const [answers, setAnswers] = useState<AnimalKey[]>([]);

    const finished = index >= QUESTIONS.length;

    const scores = useMemo(() => {
        const base: Record<AnimalKey, number> = {
            dog: 0,
            cat: 0,
            rabbit: 0,
            hamster: 0,
            parrot: 0,
            turtle: 0,
            snake: 0,
            lizard: 0,
        };
        answers.forEach((a) => base[a]++);
        return base;
    }, [answers]);

    const bestAnimal = useMemo(() => {
        return (Object.keys(scores) as AnimalKey[]).sort(
            (a, b) => scores[b] - scores[a]
        )[0];
    }, [scores]);

    const progress = Math.round((index / QUESTIONS.length) * 100);

    return (
        <div className="quizPage">
            {/* PROGRESS */}
            <div className="quizProgress">
        <span>
          Întrebarea {Math.min(index + 1, QUESTIONS.length)} /{" "}
            {QUESTIONS.length}
        </span>
                <span>{progress}%</span>
                <div className="bar">
                    <div className="fill" style={{ width: `${progress}%` }} />
                </div>
            </div>

            {!finished ? (
                <div className="quizCard">
                    <h2>{QUESTIONS[index].question}</h2>
                    <div className="answers">
                        {QUESTIONS[index].answers.map((a) => (
                            <button
                                key={a.text}
                                onClick={() => {
                                    setAnswers([...answers, a.value]);
                                    setIndex(index + 1);
                                }}
                            >
                                {a.text}
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="quizResult">
                    <h2>Rezultat</h2>
                    <h3>
                        {ANIMALS[bestAnimal].emoji} Ți se potrivește{" "}
                        {ANIMALS[bestAnimal].name}!
                    </h3>

                    <div className="quizStats">
                        {(Object.keys(ANIMALS) as AnimalKey[])
                            .sort((a, b) => scores[b] - scores[a])
                            .map((k) => (
                                <div className="quizStat" key={k}>
                                    <div>
                                        {ANIMALS[k].emoji} {ANIMALS[k].name}
                                    </div>
                                    <strong>{scores[k]}</strong>
                                </div>
                            ))}
                    </div>

                    <div className="resultActions">
                        <button onClick={() => window.location.reload()}>
                            Reîncepe quiz-ul
                        </button>
                        <Link to="/">Înapoi acasă</Link>
                        <Link className="primary" to={ANIMALS[bestAnimal].adoptPath}>
                            Vezi {ANIMALS[bestAnimal].name.toLowerCase()} pentru adopție
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
