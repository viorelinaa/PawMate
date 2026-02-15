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
    | "lizard"
    | "ferret"
    | "hedgehog"
    | "gecko"
    | "axolotl";

type Answer = {
    text: string;
    value: AnimalKey;
};

type Question = {
    question: string;
    answers: Answer[];
};

const ANIMALS: Record<AnimalKey, { name: string; emoji: string; adoptPath: string; desc: string }> =
    {
        dog: { name: "Câine", emoji: "🐶", adoptPath: "/adoptie?animal=dog", desc: "Îți place energia, plimbările și compania activă." },
        cat: { name: "Pisică", emoji: "🐱", adoptPath: "/adoptie?animal=cat", desc: "Apreciezi confortul, liniștea și vibe-ul cozy." },
        rabbit: { name: "Iepure", emoji: "🐰", adoptPath: "/adoptie?animal=rabbit", desc: "Ești blând(ă), calm(ă) și ai grijă la detalii." },
        hamster: { name: "Hamster", emoji: "🐹", adoptPath: "/adoptie?animal=hamster", desc: "Îți plac lucrurile mici, simpatice și ușor de îngrijit." },
        parrot: { name: "Papagal", emoji: "🦜", adoptPath: "/adoptie?animal=parrot", desc: "Ești sociabil(ă), comunicativ(ă) și îți place interacțiunea." },
        turtle: { name: "Broască țestoasă", emoji: "🐢", adoptPath: "/adoptie?animal=turtle", desc: "Răbdător(oare), calm(ă), îți plac ritmurile lente." },
        snake: { name: "Șarpe", emoji: "🐍", adoptPath: "/adoptie?animal=snake", desc: "Ai o latură exotică și ești super independent(ă)." },
        lizard: { name: "Șopârlă", emoji: "🦎", adoptPath: "/adoptie?animal=lizard", desc: "Îți plac animalele neobișnuite și ai spirit explorator." },
        ferret: { name: "Dihor", emoji: "🦦", adoptPath: "/adoptie?animal=ferret", desc: "Jucăuș(ă), curios(oasă), mereu în mișcare." },
        hedgehog: { name: "Arici", emoji: "🦔", adoptPath: "/adoptie?animal=hedgehog", desc: "Timid(ă) la început, dar super drăguț(ă) când te deschizi." },
        gecko: { name: "Gecko", emoji: "🦎", adoptPath: "/adoptie?animal=gecko", desc: "Minimalist(ă), chill, dar cu gust pentru exotic." },
        axolotl: { name: "Axolotl", emoji: "🦎", adoptPath: "/adoptie?animal=axolotl", desc: "Unic(ă), special(ă), îți place să ieși din tipare." },
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
            { text: "Energic(ă)", value: "dog" },
            { text: "Independent(ă)", value: "cat" },
            { text: "Blând(ă)", value: "rabbit" },
            { text: "Exotic(ă)", value: "lizard" },
        ],
    },
    {
        question: "Ce spațiu ai acasă?",
        answers: [
            { text: "Casă cu curte", value: "dog" },
            { text: "Apartament", value: "cat" },
            { text: "Spațiu mic", value: "hamster" },
            { text: "Terariu / habitat", value: "gecko" },
        ],
    },
    {
        question: "Ce te atrage cel mai mult?",
        answers: [
            { text: "Prieten loial", value: "dog" },
            { text: "Companie cozy", value: "cat" },
            { text: "Jucăuș și neastâmpărat", value: "ferret" },
            { text: "Ceva rar și special", value: "axolotl" },
        ],
    },
];

export default function Quiz() {
    const [index, setIndex] = useState(0);
    const [picked, setPicked] = useState<AnimalKey[]>([]);

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
            ferret: 0,
            hedgehog: 0,
            gecko: 0,
            axolotl: 0,
        };
        picked.forEach((k) => (base[k] += 1));
        return base;
    }, [picked]);

    const bestAnimal = useMemo(() => {
        const keys = Object.keys(scores) as AnimalKey[];
        keys.sort((a, b) => scores[b] - scores[a]);
        return keys[0] ?? "cat";
    }, [scores]);

    // progress: 0..100
    const progress = Math.round((Math.min(index, QUESTIONS.length) / QUESTIONS.length) * 100);

    const handlePick = (v: AnimalKey) => {
        setPicked((prev) => [...prev, v]);
        setIndex((prev) => prev + 1);
    };

    const restart = () => {
        setIndex(0);
        setPicked([]);
    };

    const sortedAnimals = (Object.keys(ANIMALS) as AnimalKey[]).sort((a, b) => scores[b] - scores[a]);

    return (
        <div className="quizPage">
            {/* PROGRESS */}
            <div className="quizProgress">
                <div className="quizProgressHeader">
          <span>
            Întrebarea {Math.min(index + 1, QUESTIONS.length)} / {QUESTIONS.length}
          </span>
                    <span>{progress}%</span>
                </div>
                <div className="bar">
                    <div className="fill" style={{ width: `${progress}%` }} />
                </div>
            </div>

            {!finished ? (
                <div className="quizCard">
                    <div className="quizBadge">Quiz</div>
                    <h2 className="quizTitle">{QUESTIONS[index].question}</h2>

                    <div className="answers">
                        {QUESTIONS[index].answers.map((a) => (
                            <button key={a.text} onClick={() => handlePick(a.value)}>
                                {a.text}
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="quizResult">
                    <div className="quizBadge">Rezultat</div>
                    <h2 className="resultTitle">Rezultat</h2>

                    <h3 className="resultMain">
                        {ANIMALS[bestAnimal].emoji} Ți se potrivește {ANIMALS[bestAnimal].name}!
                    </h3>
                    <p className="resultDesc">{ANIMALS[bestAnimal].desc}</p>

                    <div className="quizStats">
                        {sortedAnimals.map((k) => (
                            <div className={`quizStat ${k === bestAnimal ? "best" : ""}`} key={k}>
                                <div className="statLabel">
                                    {ANIMALS[k].emoji} {ANIMALS[k].name}
                                </div>
                                <strong className="statValue">{scores[k]}</strong>
                            </div>
                        ))}
                    </div>

                    <div className="resultActions">
                        <button className="btn primary" onClick={restart}>
                            Reîncepe quiz-ul
                        </button>

                        <Link className="btn ghost" to="/">
                            Înapoi acasă
                        </Link>

                        <Link className="btn secondary" to={ANIMALS[bestAnimal].adoptPath}>
                            Vezi {ANIMALS[bestAnimal].name.toLowerCase()} pentru adopție
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
