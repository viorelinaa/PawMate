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

type TraitKey =
    | "energy"
    | "careTime"
    | "sociability"
    | "livingSetup"
    | "affection"
    | "homeAtmosphere"
    | "exoticLevel";

type TraitProfile = Record<TraitKey, number>;

type Answer = {
    text: string;
    score: number;
};

type Question = {
    question: string;
    trait: TraitKey;
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
        emoji: "🫧",
        adoptPath: "/adoptie?animal=axolotl",
        desc: "Unic(ă) și special(ă). Îți place să ieși din tipare.",
    },
};

const ANIMAL_PROFILES: Record<AnimalKey, TraitProfile> = {
    dog: {
        energy: 4,
        careTime: 4,
        sociability: 4,
        livingSetup: 4,
        affection: 4,
        homeAtmosphere: 3,
        exoticLevel: 0,
    },
    cat: {
        energy: 1,
        careTime: 2,
        sociability: 1,
        livingSetup: 2,
        affection: 2,
        homeAtmosphere: 0,
        exoticLevel: 0,
    },
    rabbit: {
        energy: 2,
        careTime: 2,
        sociability: 2,
        livingSetup: 1,
        affection: 2,
        homeAtmosphere: 2,
        exoticLevel: 1,
    },
    hamster: {
        energy: 1,
        careTime: 1,
        sociability: 0,
        livingSetup: 1,
        affection: 1,
        homeAtmosphere: 1,
        exoticLevel: 1,
    },
    parrot: {
        energy: 3,
        careTime: 3,
        sociability: 4,
        livingSetup: 2,
        affection: 3,
        homeAtmosphere: 4,
        exoticLevel: 2,
    },
    turtle: {
        energy: 0,
        careTime: 1,
        sociability: 0,
        livingSetup: 0,
        affection: 0,
        homeAtmosphere: 0,
        exoticLevel: 2,
    },
    snake: {
        energy: 0,
        careTime: 0,
        sociability: 0,
        livingSetup: 0,
        affection: 0,
        homeAtmosphere: 0,
        exoticLevel: 4,
    },
    lizard: {
        energy: 1,
        careTime: 1,
        sociability: 0,
        livingSetup: 0,
        affection: 0,
        homeAtmosphere: 1,
        exoticLevel: 3,
    },
    ferret: {
        energy: 4,
        careTime: 3,
        sociability: 3,
        livingSetup: 2,
        affection: 3,
        homeAtmosphere: 2,
        exoticLevel: 2,
    },
    hedgehog: {
        energy: 1,
        careTime: 1,
        sociability: 0,
        livingSetup: 1,
        affection: 1,
        homeAtmosphere: 0,
        exoticLevel: 2,
    },
    gecko: {
        energy: 1,
        careTime: 1,
        sociability: 0,
        livingSetup: 0,
        affection: 0,
        homeAtmosphere: 1,
        exoticLevel: 3,
    },
    axolotl: {
        energy: 0,
        careTime: 1,
        sociability: 0,
        livingSetup: 0,
        affection: 0,
        homeAtmosphere: 1,
        exoticLevel: 4,
    },
};

const QUESTIONS: Question[] = [
    {
        trait: "energy",
        question: "Cum îți place energia în viața de zi cu zi?",
        answers: [
            { text: "Multă energie, mereu în mișcare", score: 4 },
            { text: "Echilibrat(ă), depinde de zi", score: 3 },
            { text: "Liniște și calm", score: 1 },
            { text: "Foarte calm, fără grabă", score: 0 },
        ],
    },
    {
        trait: "careTime",
        question: "Cât timp poți dedica îngrijirii zilnice?",
        answers: [
            { text: "Mult (60+ min)", score: 4 },
            { text: "Mediu (30–60 min)", score: 3 },
            { text: "Puțin (10–30 min)", score: 1 },
            { text: "Minim (5–10 min)", score: 0 },
        ],
    },
    {
        trait: "sociability",
        question: "Ce tip de personalitate te descrie cel mai bine?",
        answers: [
            { text: "Sociabil(ă) și loial(ă)", score: 4 },
            { text: "Independent(ă) și cool", score: 1 },
            { text: "Blând(ă) și sensibil(ă)", score: 2 },
            { text: "Curios(oasă) și jucăuș(ă)", score: 3 },
        ],
    },
    {
        trait: "livingSetup",
        question: "Ce spațiu sau tip de habitat ai disponibil acasă?",
        answers: [
            { text: "Casă cu curte", score: 4 },
            { text: "Apartament normal", score: 2 },
            { text: "Spațiu mic / cameră", score: 1 },
            { text: "Terariu / habitat special", score: 0 },
        ],
    },
    {
        trait: "affection",
        question: "Ce te atrage mai mult la un animal?",
        answers: [
            { text: "Companie și afecțiune", score: 4 },
            { text: "Vibe cozy și liniște", score: 2 },
            { text: "Drăgălășenie discretă", score: 1 },
            { text: "Ceva rar / wow", score: 0 },
        ],
    },
    {
        trait: "homeAtmosphere",
        question: "Ce fel de atmosferă preferi acasă?",
        answers: [
            { text: "Îmi place comunicarea / sunetele", score: 4 },
            { text: "Mai bine liniște", score: 0 },
            { text: "Nu contează, mă adaptez", score: 2 },
            { text: "Chill total", score: 1 },
        ],
    },
    {
        trait: "exoticLevel",
        question: "Cât de exotic vrei să fie animalul?",
        answers: [
            { text: "Clasic", score: 0 },
            { text: "Ușor diferit", score: 1 },
            { text: "Exotic, dar ușor", score: 3 },
            { text: "Foarte exotic", score: 4 },
        ],
    },
];

const ANIMAL_ORDER = Object.keys(ANIMALS) as AnimalKey[];
const MAX_TRAIT_SCORE = 4;

function AnswerButton({ answer, onPick }: { answer: Answer; onPick: (score: number) => void }) {
    return (
        <AppButton variant="ghost" onClick={() => onPick(answer.score)}>
            {answer.text}
        </AppButton>
    );
}

function OtherAnimalItem({ animalKey, percent }: { animalKey: AnimalKey; percent: number }) {
    return (
        <div className="otherAnimal">
            <span>{ANIMALS[animalKey].emoji} {ANIMALS[animalKey].name}</span>
            <strong>{percent}%</strong>
        </div>
    );
}

export default function Quiz() {
    const { currentUser, isAuthenticated } = useAuth();
    const [index, setIndex] = useState(0);
    const [picked, setPicked] = useState<number[]>([]);
    const [completionId, setCompletionId] = useState(0);
    const [savedResultKey, setSavedResultKey] = useState<string | null>(null);
    const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error" | "login_required">("idle");
    const [saveMessage, setSaveMessage] = useState<string | null>(null);

    const finished = index >= QUESTIONS.length;

    const compatibilityScoresRaw = useMemo(() => {
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

        picked.forEach((answerScore, questionIndex) => {
            const question = QUESTIONS[questionIndex];
            if (!question) {
                return;
            }

            ANIMAL_ORDER.forEach((animalKey) => {
                const animalPreference = ANIMAL_PROFILES[animalKey][question.trait];
                base[animalKey] += MAX_TRAIT_SCORE - Math.abs(answerScore - animalPreference);
            });
        });

        return base;
    }, [picked]);

    const compatibilityScores = useMemo(() => {
        const maxPossibleScore = picked.length * MAX_TRAIT_SCORE;

        return ANIMAL_ORDER.reduce<Record<AnimalKey, number>>((acc, animalKey) => {
            acc[animalKey] =
                maxPossibleScore === 0
                    ? 0
                    : Math.round((compatibilityScoresRaw[animalKey] / maxPossibleScore) * 100);
            return acc;
        }, {
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
        });
    }, [compatibilityScoresRaw, picked.length]);

    const bestAnimal = useMemo(() => {
        return ANIMAL_ORDER.reduce((currentBest, animalKey) => {
            if (compatibilityScores[animalKey] > compatibilityScores[currentBest]) {
                return animalKey;
            }

            return currentBest;
        }, "cat" as AnimalKey);
    }, [compatibilityScores]);

    const resultSummary = useMemo(() => {
        if (!finished) {
            return null;
        }

        return {
            animalKey: bestAnimal,
            animalName: ANIMALS[bestAnimal].name,
            score: compatibilityScores[bestAnimal],
            totalQuestions: 100,
        };
    }, [bestAnimal, compatibilityScores, finished]);

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
            setSaveMessage("Autentifică-te ca să salvăm rezultatul quizului în profil.");
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
                setSaveMessage("Se salvează rezultatul quizului în profil...");

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
                setSaveMessage("Ultimul rezultat al quizului a fost salvat în profil.");
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

    const handlePick = (answerScore: number) => {
        const nextIndex = index + 1;
        setPicked((prev) => [...prev, answerScore]);
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

    const otherAnimalsSorted = ANIMAL_ORDER
        .filter((animalKey) => animalKey !== bestAnimal)
        .sort((left, right) => compatibilityScores[right] - compatibilityScores[left]);

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
                        {QUESTIONS[index].answers.map((answer) => (
                            <AnswerButton key={answer.text} answer={answer} onPick={handlePick} />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="quizResult">
                    <div className="quizBadge">Rezultat</div>

                    <div className="winner">
                        <div className="winnerEmoji">{ANIMALS[bestAnimal].emoji}</div>
                        <h3 className="winnerName">
                            Ți se potrivește {ANIMALS[bestAnimal].name}!
                        </h3>
                        <p className="winnerDesc">{ANIMALS[bestAnimal].desc}</p>
                        {resultSummary && (
                            <p className="winnerScore">
                                Compatibilitate estimată: {resultSummary.score}%
                            </p>
                        )}
                    </div>

                    {saveMessage && (
                        <div className={`quizSaveNotice ${saveState === "saved" ? "success" : ""} ${saveState === "error" ? "error" : ""}`}>
                            {saveMessage}
                        </div>
                    )}

                    <div className="otherResults">
                        {otherAnimalsSorted.map((animalKey) => (
                            <OtherAnimalItem
                                key={animalKey}
                                animalKey={animalKey}
                                percent={compatibilityScores[animalKey]}
                            />
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
