import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { AppButton } from "../components/AppButton";
import { useAuth } from "../context/AuthContext";
import {
    createVolunteerApplication,
    getMyVolunteerApplications,
    type VolunteerApplication,
} from "../services/volunteerService";
import {
    PHONE_HINT,
    PHONE_PATTERN,
    collectFormValidationErrors,
    updateSingleFieldError,
} from "../utils/formValidation";
import "../styles/Voluntariat.css";

const activityOptions = [
    "Ingrijire animale",
    "Plimbari cu cainii",
    "Socializare pisici",
    "Fotografie animale",
    "Evenimente si campanii",
    "Transport animale",
    "Social media",
    "Educatie comunitate",
];

const availabilityOptions = [
    { value: "Weekend", label: "Weekend" },
    { value: "In timpul saptamanii", label: "In timpul saptamanii" },
    { value: "Oricand", label: "Oricand" },
    { value: "Ocazional", label: "Ocazional" },
];

const experienceOptions = [
    { value: "Fara experienta", label: "Fara experienta" },
    { value: "Putina experienta", label: "Putina experienta" },
    { value: "Experienta moderata", label: "Experienta moderata" },
    { value: "Multa experienta", label: "Multa experienta" },
    { value: "Profesional", label: "Profesional" },
];

function splitName(name?: string) {
    const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);

    return {
        firstName: parts[0] ?? "",
        lastName: parts.slice(1).join(" "),
    };
}

function formatDate(value?: string | null) {
    if (!value) {
        return "data indisponibila";
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return "data indisponibila";
    }

    return new Intl.DateTimeFormat("ro-RO", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(date);
}

export default function Voluntariat() {
    const formRef = useRef<HTMLFormElement | null>(null);
    const navigate = useNavigate();
    const { currentUser, isAuthenticated } = useAuth();
    const [submittedApplication, setSubmittedApplication] = useState<VolunteerApplication | null>(null);
    const [latestApplication, setLatestApplication] = useState<VolunteerApplication | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isCheckingApplications, setIsCheckingApplications] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [formError, setFormError] = useState<string | null>(null);
    const userName = useMemo(() => splitName(currentUser?.name), [currentUser?.name]);
    const applicationToShow = submittedApplication ?? latestApplication;

    useEffect(() => {
        if (!isAuthenticated) {
            setLatestApplication(null);
            return;
        }

        let isMounted = true;

        async function loadExistingApplication() {
            try {
                setIsCheckingApplications(true);
                const applications = await getMyVolunteerApplications();
                if (isMounted) {
                    setLatestApplication(applications[0] ?? null);
                    setFormError(null);
                }
            } catch (err) {
                if (isMounted) {
                    setFormError(err instanceof Error ? err.message : "Nu s-a putut verifica daca ai cereri existente.");
                }
            } finally {
                if (isMounted) {
                    setIsCheckingApplications(false);
                }
            }
        }

        void loadExistingApplication();

        return () => {
            isMounted = false;
        };
    }, [isAuthenticated]);

    const handleFieldBlur = (
        e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setFieldErrors((prev) => updateSingleFieldError(e.target, prev));
    };

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setFormError(null);

        if (!isAuthenticated) {
            setFormError("Autentifica-te ca sa poti trimite cererea de voluntariat.");
            return;
        }

        const { errors, firstInvalidElement } = collectFormValidationErrors(e.currentTarget);
        setFieldErrors(errors);

        if (firstInvalidElement) {
            firstInvalidElement.focus();
            return;
        }

        const submittedData = new FormData(e.currentTarget);
        const age = Number(submittedData.get("varsta") ?? 0);

        try {
            setIsLoading(true);
            const application = await createVolunteerApplication({
                firstName: String(submittedData.get("prenume") ?? "").trim(),
                lastName: String(submittedData.get("nume") ?? "").trim(),
                email: String(submittedData.get("email") ?? "").trim(),
                phone: String(submittedData.get("telefon") ?? "").trim(),
                age,
                experience: String(submittedData.get("experienta") ?? "").trim(),
                availability: String(submittedData.get("disponibilitate") ?? "").trim(),
                activities: submittedData.getAll("activitati").map(String),
                message: String(submittedData.get("mesaj") ?? "").trim(),
            });

            setSubmittedApplication(application);
            setLatestApplication(application);
            setFieldErrors({});
            formRef.current?.reset();
        } catch (err) {
            setFormError(err instanceof Error ? err.message : "A aparut o eroare la trimiterea cererii.");
        } finally {
            setIsLoading(false);
        }
    }

    function resetForm() {
        formRef.current?.reset();
        setFieldErrors({});
        setFormError(null);
    }

    return (
        <div className="voluntariatPage">
            <section className="voluntariatHero">
                <div className="voluntariatCloud vc1" />
                <div className="voluntariatCloud vc2" />
                <div className="voluntariatHeroInner">
                    <p className="voluntariatEyebrow">PawMate community</p>
                    <h1 className="voluntariatTitle heroTitle">Voluntariat</h1>
                    <p className="voluntariatSub heroSubtitle">
                        O ora oferita cu grija poate insemna o zi mai linistita pentru un animal care asteapta ajutor.
                    </p>
                </div>
            </section>

            <section className="volunteerApplicationSection">
                <div className="volunteerIntroPanel">
                    <p className="volunteerIntroKicker">Implica-te cu rost</p>
                    <h2>Ajuta adaposturile, campaniile si animalele care au nevoie de oameni buni aproape.</h2>
                    <p>
                        Completeaza cererea de voluntariat, iar echipa PawMate o va verifica. Raspunsul si comentariul
                        adminului vor aparea in profilul tau, in sectiunea Voluntariat.
                    </p>
                </div>

                {!isAuthenticated ? (
                    <div className="volunteerStateCard">
                        <h2>Autentifica-te ca sa trimiti cererea</h2>
                        <p>
                            Pastram cererea in profilul tau, ca sa poti vedea usor daca a fost aprobata sau respinsa.
                        </p>
                        <AppButton
                            type="button"
                            variant="primary"
                            size="md"
                            className="btnSubmit"
                            onClick={() => navigate("/login")}
                        >
                            Mergi la login
                        </AppButton>
                    </div>
                ) : isCheckingApplications ? (
                    <div className="volunteerStateCard">
                        <h2>Verificam cererile tale...</h2>
                        <p>Incarcam starea curenta a profilului tau de voluntariat.</p>
                    </div>
                ) : applicationToShow ? (
                    <div className="volunteerStateCard volunteerStateCardSuccess">
                        <span className="volunteerStateBadge">Cerere trimisa</span>
                        <h2>Cererea ta va fi procesata in curand.</h2>
                        <p>
                            Iti multumim pentru dorinta de a ajuta. Vei primi un raspuns in sectiunea Voluntariat din
                            profil, impreuna cu detaliile scrise de admin dupa verificare.
                        </p>
                        <div className="volunteerStateDetails">
                            <span>Trimisa la {formatDate(applicationToShow.createdAt)}</span>
                            <span>Status: {applicationToShow.status === "pending" ? "In procesare" : applicationToShow.status}</span>
                        </div>
                        <AppButton
                            type="button"
                            variant="primary"
                            size="md"
                            className="btnSubmit"
                            onClick={() => navigate("/profile?tab=volunteer")}
                        >
                            Vezi cererea in profil
                        </AppButton>
                    </div>
                ) : (
                    <form ref={formRef} onSubmit={handleSubmit} className="volunteerForm" noValidate>
                        {formError ? <div className="profile-feedback error">{formError}</div> : null}

                        <div className="formGrid">
                            <div className="formGroup">
                                <label htmlFor="nume">Nume *</label>
                                <input
                                    type="text"
                                    id="nume"
                                    name="nume"
                                    defaultValue={userName.lastName}
                                    onBlur={handleFieldBlur}
                                    required
                                    placeholder="Popescu"
                                    disabled={isLoading}
                                    className={`formInput ${fieldErrors.nume ? "field-invalid" : ""}`}
                                    aria-invalid={Boolean(fieldErrors.nume)}
                                    aria-describedby={fieldErrors.nume ? "volunteer-nume-error" : undefined}
                                />
                                {fieldErrors.nume ? (
                                    <p className="validation-error" id="volunteer-nume-error">{fieldErrors.nume}</p>
                                ) : null}
                            </div>

                            <div className="formGroup">
                                <label htmlFor="prenume">Prenume *</label>
                                <input
                                    type="text"
                                    id="prenume"
                                    name="prenume"
                                    defaultValue={userName.firstName}
                                    onBlur={handleFieldBlur}
                                    required
                                    placeholder="Ion"
                                    disabled={isLoading}
                                    className={`formInput ${fieldErrors.prenume ? "field-invalid" : ""}`}
                                    aria-invalid={Boolean(fieldErrors.prenume)}
                                    aria-describedby={fieldErrors.prenume ? "volunteer-prenume-error" : undefined}
                                />
                                {fieldErrors.prenume ? (
                                    <p className="validation-error" id="volunteer-prenume-error">{fieldErrors.prenume}</p>
                                ) : null}
                            </div>

                            <div className="formGroup">
                                <label htmlFor="email">Email *</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    defaultValue={currentUser?.email ?? ""}
                                    onBlur={handleFieldBlur}
                                    required
                                    placeholder="ion.popescu@email.com"
                                    disabled={isLoading}
                                    className={`formInput ${fieldErrors.email ? "field-invalid" : ""}`}
                                    aria-invalid={Boolean(fieldErrors.email)}
                                    aria-describedby={fieldErrors.email ? "volunteer-email-error" : undefined}
                                />
                                {fieldErrors.email ? (
                                    <p className="validation-error" id="volunteer-email-error">{fieldErrors.email}</p>
                                ) : null}
                            </div>

                            <div className="formGroup">
                                <label htmlFor="telefon">Telefon *</label>
                                <input
                                    type="tel"
                                    id="telefon"
                                    name="telefon"
                                    onBlur={handleFieldBlur}
                                    required
                                    placeholder="060000000"
                                    pattern={PHONE_PATTERN}
                                    title={PHONE_HINT}
                                    inputMode="numeric"
                                    autoComplete="tel"
                                    disabled={isLoading}
                                    className={`formInput ${fieldErrors.telefon ? "field-invalid" : ""}`}
                                    aria-invalid={Boolean(fieldErrors.telefon)}
                                    aria-describedby={fieldErrors.telefon ? "volunteer-telefon-error" : undefined}
                                />
                                {fieldErrors.telefon ? (
                                    <p className="validation-error" id="volunteer-telefon-error">{fieldErrors.telefon}</p>
                                ) : null}
                            </div>

                            <div className="formGroup">
                                <label htmlFor="varsta">Varsta *</label>
                                <input
                                    type="number"
                                    id="varsta"
                                    name="varsta"
                                    onBlur={handleFieldBlur}
                                    required
                                    min="16"
                                    placeholder="18"
                                    disabled={isLoading}
                                    className={`formInput ${fieldErrors.varsta ? "field-invalid" : ""}`}
                                    aria-invalid={Boolean(fieldErrors.varsta)}
                                    aria-describedby={fieldErrors.varsta ? "volunteer-varsta-error" : undefined}
                                />
                                {fieldErrors.varsta ? (
                                    <p className="validation-error" id="volunteer-varsta-error">{fieldErrors.varsta}</p>
                                ) : null}
                            </div>

                            <div className="formGroup">
                                <label htmlFor="disponibilitate">Disponibilitate *</label>
                                <select
                                    id="disponibilitate"
                                    name="disponibilitate"
                                    defaultValue=""
                                    onBlur={handleFieldBlur}
                                    required
                                    disabled={isLoading}
                                    className={`formSelect ${fieldErrors.disponibilitate ? "field-invalid" : ""}`}
                                    aria-invalid={Boolean(fieldErrors.disponibilitate)}
                                    aria-describedby={fieldErrors.disponibilitate ? "volunteer-disponibilitate-error" : undefined}
                                >
                                    <option value="">Alege optiune</option>
                                    {availabilityOptions.map((option) => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}
                                </select>
                                {fieldErrors.disponibilitate ? (
                                    <p className="validation-error" id="volunteer-disponibilitate-error">
                                        {fieldErrors.disponibilitate}
                                    </p>
                                ) : null}
                            </div>
                        </div>

                        <div className="formGroup">
                            <label htmlFor="experienta">Experienta cu animale</label>
                            <select
                                id="experienta"
                                name="experienta"
                                defaultValue=""
                                onBlur={handleFieldBlur}
                                disabled={isLoading}
                                className="formSelect"
                            >
                                <option value="">Alege optiune</option>
                                {experienceOptions.map((option) => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="formGroup">
                            <label>Activitati de interes</label>
                            <div className="checkboxGrid">
                                {activityOptions.map((activity) => (
                                    <label key={activity} className="checkboxLabel">
                                        <input
                                            type="checkbox"
                                            name="activitati"
                                            value={activity}
                                            disabled={isLoading}
                                        />
                                        <span>{activity}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="formGroup">
                            <label htmlFor="mesaj">Spune-ne mai multe despre tine</label>
                            <textarea
                                id="mesaj"
                                name="mesaj"
                                onBlur={handleFieldBlur}
                                rows={4}
                                placeholder="De ce vrei sa devii voluntar? Ce te motiveaza?"
                                disabled={isLoading}
                                className="formTextarea"
                            />
                        </div>

                        <div className="formActions">
                            <AppButton
                                type="button"
                                onClick={resetForm}
                                className="btnReset"
                                variant="ghost"
                                disabled={isLoading}
                            >
                                Reset formular
                            </AppButton>
                            <AppButton
                                type="submit"
                                className="btnSubmit"
                                variant="primary"
                                disabled={isLoading}
                            >
                                {isLoading ? "Se trimite..." : "Trimite cererea"}
                            </AppButton>
                        </div>
                    </form>
                )}
            </section>

            <section className="activitiesSection">
                <h2 className="sectionTitle">Unde poti ajuta</h2>
                <p className="sectionSubtitle">Alege activitatile care ti se potrivesc cel mai bine.</p>
                <div className="activityCards">
                    {activityOptions.map((activity) => (
                        <div className="activityCard" key={activity}>
                            <h3>{activity}</h3>
                            <p>Contribuie cu timp, rabdare si grija in comunitatea PawMate.</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
