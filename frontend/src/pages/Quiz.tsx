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
        question: "Cum îți place energia în viața de zi cu zi?",
        answers: [
            { text: "Multă energie, mereu în mișcare", value: "dog" },
            { text: "Echilibrat(ă), depinde de zi", value: "ferret" },
            { text: "Liniște și calm", value: "cat" },
            { text: "Foarte calm, fără grabă", value: "turtle" },
        ],
    },
    {
        question: "Cât timp poți dedica îngrijirii zilnice?",
        answers: [
            { text: "Mult (60+ min)", value: "dog" },
            { text: "Mediu (30–60 min)", value: "cat" },
            { text: "Puțin (10–30 min)", value: "hamster" },
            { text: "Minim (5–10 min)", value: "snake" },
        ],
    },
    {
        question: "Ce tip de personalitate te descrie cel mai bine?",
        answers: [
            { text: "Sociabil(ă) și loial(ă)", value: "dog" },
            { text: "Independent(ă) și cool", value: "cat" },
            { text: "Blând(ă) și sensibil(ă)", value: "rabbit" },
            { text: "Curios(oasă) și jucăuș(ă)", value: "ferret" },
        ],
    },
    {
        question: "Ce spațiu ai acasă?",
        answers: [
            { text: "Casă cu curte", value: "dog" },
            { text: "Apartament normal", value: "cat" },
            { text: "Spațiu mic / cameră", value: "hamster" },
            { text: "Terariu / habitat special", value: "gecko" },
        ],
    },
    {
        question: "Ce te atrage mai mult la un animal?",
        answers: [
            { text: "Companie și afecțiune", value: "dog" },
            { text: "Vibe cozy și liniște", value: "cat" },
            { text: "Drăgălășenie discretă", value: "hedgehog" },
            { text: "Ceva rar / wow", value: "axolotl" },
        ],
    },

    /* ✅ întrebări dedicate pentru animalele “mai greu de nimerit” */
    {
        question: "Ce fel de sunete/atmosferă preferi?",
        answers: [
            { text: "Îmi place să fie viață și comunicare", value: "parrot" },
            { text: "Mai bine liniște", value: "cat" },
            { text: "Puțin sunet e ok", value: "dog" },
            { text: "Nu contează", value: "turtle" },
        ],
    },
    {
        question: "Ce îți place să faci când te relaxezi?",
        answers: [
            { text: "Să observ lucruri, calm", value: "turtle" },
            { text: "Să stau cozy în pat", value: "cat" },
            { text: "Să mă joc / să fac ceva activ", value: "dog" },
            { text: "Să meșteresc / să explorez ceva nou", value: "lizard" },
        ],
    },
    {
        question: "Cât de 'exotic' vrei să fie animalul tău?",
        answers: [
            { text: "Deloc, clasic", value: "dog" },
            { text: "Puțin (dar tot friendly)", value: "rabbit" },
            { text: "Exotic, dar ușor", value: "gecko" },
            { text: "Foarte exotic", value: "snake" },
        ],
    },
    {
        question: "Cum ești tu cu rutina?",
        answers: [
            { text: "Îmi place rutina și disciplina", value: "dog" },
            { text: "Îmi place libertatea", value: "cat" },
            { text: "Prefer lucruri simple", value: "hamster" },
            { text: "Îmi place să fie diferit mereu", value: "ferret" },
        ],
    },
    {
        question: "Ce animal te atrage cel mai mult, chiar din instinct?",
        answers: [
            { text: "🐰 Iepure", value: "rabbit" },
            { text: "🦜 Papagal", value: "parrot" },
            { text: "🦔 Arici", value: "hedgehog" },
            { text: "🦎 Axolotl (super rar!)", value: "axolotl" },
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

        const max = Math.max(...keys.map((k) => scores[k]));

        const top = keys.filter((k) => scores[k] === max);

        return top[Math.floor(Math.random() * top.length)] ?? "cat";
    }, [scores]);


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
