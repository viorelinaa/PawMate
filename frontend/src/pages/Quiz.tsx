import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Quiz.css";
import { AdminOnly } from "../components/AdminOnly";
import { AppButton } from "../components/AppButton";
import { AddActionButton } from "../components/AddActionButton";
import { useAuth } from "../context/AuthContext";
import { saveQuizResult } from "../services/quizService";

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

const ANIMALS: Record<
    AnimalKey,
    { name: string; emoji: string; adoptPath: string; desc: string }
> = {
    dog: {
        name: "Câine",
        emoji: "🐶",
        adoptPath: "/adoptie?animal=dog",
        desc: "Îți place energia, plimbările și compania activă.",
    },
    cat: {
        name: "Pisică",
        emoji: "🐱",
        adoptPath: "/adoptie?animal=cat",
        desc: "Apreciezi confortul, liniștea și vibe-ul cozy.",
    },
    rabbit: {
        name: "Iepure",
        emoji: "🐰",
        adoptPath: "/adoptie?animal=rabbit",
        desc: "Ești blând(ă), calm(ă) și atent(ă) la detalii.",
    },
    hamster: {
        name: "Hamster",
        emoji: "🐹",
        adoptPath: "/adoptie?animal=hamster",
        desc: "Îți plac lucrurile mici, simpatice și ușor de îngrijit.",
    },
    parrot: {
        name: "Papagal",
        emoji: "🦜",
        adoptPath: "/adoptie?animal=parrot",
        desc: "Ești sociabil(ă) și îți place interacțiunea.",
    },
    turtle: {
        name: "Broască țestoasă",
        emoji: "🐢",
        adoptPath: "/adoptie?animal=turtle",
        desc: "Calm(ă), răbdător(oare), îți place ritmul lent.",
    },
    snake: {
        name: "Șarpe",
        emoji: "🐍",
        adoptPath: "/adoptie?animal=snake",
        desc: "Ai o latură exotică și ești foarte independent(ă).",
    },
    lizard: {
        name: "Șopârlă",
        emoji: "🦎",
        adoptPath: "/adoptie?animal=lizard",
        desc: "Îți plac animalele neobișnuite și explorarea.",
    },
    ferret: {
        name: "Dihor",
        emoji: "🦦",
        adoptPath: "/adoptie?animal=ferret",
        desc: "Jucăuș(ă), curios(oasă), mereu în mișcare.",
    },
    hedgehog: {
        name: "Arici",
        emoji: "🦔",
        adoptPath: "/adoptie?animal=hedgehog",
        desc: "Timid(ă) la început, dar super sweet când te cunoaște.",
    },
    gecko: {
        name: "Gecko",
        emoji: "🦎",
        adoptPath: "/adoptie?animal=gecko",
        desc: "Exotic, dar chill. Îți place ceva diferit și simplu.",
    },
    axolotl: {
        name: "Axolotl",
        emoji: "🦎",
        adoptPath: "/adoptie?animal=axolotl",
        desc: "Unic(ă) și special(ă). Îți place să ieși din tipare.",
    },
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
    {
        question: "Ce fel de atmosferă preferi acasă?",
        answers: [
            { text: "Îmi place comunicarea / sunetele", value: "parrot" },
            { text: "Mai bine liniște", value: "cat" },
            { text: "Nu contează, mă adaptez", value: "rabbit" },
            { text: "Chill total", value: "turtle" },
        ],
    },
    {
        question: "Cât de exotic vrei să fie animalul?",
        answers: [
            { text: "Clasic", value: "dog" },
            { text: "Ușor diferit", value: "rabbit" },
            { text: "Exotic, dar ușor", value: "lizard" },
            { text: "Foarte exotic", value: "snake" },
        ],
    },
];

const ANIMAL_ORDER = Object.keys(ANIMALS) as AnimalKey[];

function AnswerButton({ answer, onPick }: { answer: Answer; onPick: (v: AnimalKey) => void }) {
    return (
        <AppButton variant="ghost" onClick={() => onPick(answer.value)}>
            {answer.text}
        </AppButton>
    );
}

function OtherAnimalItem({ animalKey, score }: { animalKey: AnimalKey; score: number }) {
    return (
        <div className="otherAnimal">
            <span>{ANIMALS[animalKey].emoji} {ANIMALS[animalKey].name}</span>
            <strong>{score}</strong>
        </div>
    );
}

export default function Quiz() {
    const { currentUser, isAuthenticated } = useAuth();
    const [index, setIndex] = useState(0);
    const [picked, setPicked] = useState<AnimalKey[]>([]);
    const [completionId, setCompletionId] = useState(0);
    const [savedResultKey, setSavedResultKey] = useState<string | null>(null);
    const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error" | "login_required">("idle");
    const [saveMessage, setSaveMessage] = useState<string | null>(null);

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
        const max = Math.max(...ANIMAL_ORDER.map((animalKey) => scores[animalKey]));
        return ANIMAL_ORDER.find((animalKey) => scores[animalKey] === max) ?? "cat";
    }, [scores]);

    const resultSummary = useMemo(() => {
        if (!finished) {
            return null;
        }

        return {
            animalKey: bestAnimal,
            animalName: ANIMALS[bestAnimal].name,
            score: scores[bestAnimal],
            totalQuestions: QUESTIONS.length,
        };
    }, [bestAnimal, finished, scores]);

    const currentSaveKey = currentUser ? `${completionId}:${currentUser.id}` : null;

    const progress = Math.round(
        (Math.min(index, QUESTIONS.length) / QUESTIONS.length) * 100
    );

    useEffect(() => {
        if (!finished || !resultSummary || completionId === 0) {
            return;
        }

        if (!isAuthenticated || !currentUser) {
            setSaveState("login_required");
            setSaveMessage("Autentifica-te ca sa salvam rezultatul quizului in profil.");
            return;
        }

        if (currentSaveKey !== null && savedResultKey === currentSaveKey) {
            return;
        }

        const authenticatedUser = currentUser;
        const summary = resultSummary;
        let isCancelled = false;

        async function persistResult() {
            const userId = authenticatedUser.id;
            const { animalKey, animalName, score, totalQuestions } = summary;

            try {
                setSaveState("saving");
                setSaveMessage("Se salveaza rezultatul quizului in profil...");

                await saveQuizResult({
                    userId,
                    animalKey,
                    animalName,
                    score,
                    totalQuestions,
                });

                if (isCancelled || currentSaveKey === null) {
                    return;
                }

                setSavedResultKey(currentSaveKey);
                setSaveState("saved");
                setSaveMessage("Ultimul rezultat al quizului a fost salvat in profil.");
            } catch (err) {
                if (isCancelled) {
                    return;
                }

                setSaveState("error");
                setSaveMessage(
                    err instanceof Error
                        ? err.message
                        : "Nu s-a putut salva rezultatul quizului."
                );
            }
        }

        void persistResult();

        return () => {
            isCancelled = true;
        };
    }, [completionId, currentSaveKey, currentUser, finished, isAuthenticated, resultSummary, savedResultKey]);

    const handlePick = (v: AnimalKey) => {
        const nextIndex = index + 1;
        setPicked((prev) => [...prev, v]);
        setIndex(nextIndex);

        if (nextIndex >= QUESTIONS.length) {
            setCompletionId((prev) => prev + 1);
        }
    };

    const restart = () => {
        setIndex(0);
        setPicked([]);
        setSaveState("idle");
        setSaveMessage(null);
    };

    const otherAnimalsSorted = (Object.keys(ANIMALS) as AnimalKey[])
        .filter((k) => k !== bestAnimal)
        .sort((a, b) => scores[b] - scores[a]);

    return (
        <div className="quizPage">
            <AdminOnly>
                <div className="roleActionBar addQuestionBar">
                    <AddActionButton
                        className="addQuestionBtn"
                        label="Adaugă întrebare"
                        onClick={() => alert("Formular adăugare întrebare — în curând!")}
                    />
                </div>
            </AdminOnly>
            {/* PROGRESS */}
            <div className="quizProgress">
                <div className="quizProgressHeader">
          <span>
            Întrebarea {Math.min(index + 1, QUESTIONS.length)} /{" "}
              {QUESTIONS.length}
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
                            <AnswerButton key={a.text} answer={a} onPick={handlePick} />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="quizResult">
                    <div className="quizBadge">Rezultat</div>

                    {/* WINNER BIG */}
                    <div className="winner">
                        <div className="winnerEmoji">{ANIMALS[bestAnimal].emoji}</div>
                        <h3 className="winnerName">
                            Ți se potrivește {ANIMALS[bestAnimal].name}!
                        </h3>
                        <p className="winnerDesc">{ANIMALS[bestAnimal].desc}</p>
                        {resultSummary && (
                            <p className="winnerScore">
                                Scor de compatibilitate: {resultSummary.score}/{resultSummary.totalQuestions}
                            </p>
                        )}
                    </div>

                    {saveMessage && (
                        <div className={`quizSaveNotice ${saveState === "saved" ? "success" : ""} ${saveState === "error" ? "error" : ""}`}>
                            {saveMessage}
                        </div>
                    )}

                    {/* OTHERS SMALL */}
                    <div className="otherResults">
                        {otherAnimalsSorted.map((k) => (
                            <OtherAnimalItem key={k} animalKey={k} score={scores[k]} />
                        ))}
                    </div>

                    <div className="resultActions">
                        <AppButton className="btn primary" variant="primary" onClick={restart}>
                            Reîncepe quiz-ul
                        </AppButton>

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
