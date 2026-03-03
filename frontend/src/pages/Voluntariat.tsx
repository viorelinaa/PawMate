import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import "../styles/Voluntariat.css";
import { AppButton } from "../components/AppButton";
import {
    PHONE_HINT,
    PHONE_PATTERN,
    collectFormValidationErrors,
    updateSingleFieldError
} from "../utils/formValidation";
export default function Voluntariat() {
    const [formData, setFormData] = useState({
        nume: "",
        prenume: "",
        email: "",
        telefon: "",
        varsta: "",
        experienta: "",
        disponibilitate: "",
        activitati: [] as string[],
        mesaj: ""
    });

    const [submitted, setSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const activitatiList = [
        "Îngrijire animale",
        "Plimbări cu câinii",
        "Socializare pisici",
        "Fotografie animale",
        "Evenimente și campanii",
        "Transport animale",
        "Social Media",
        "Educație comunitate"
    ];

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setFieldErrors(prev => updateSingleFieldError(e.target, prev));
    };

    const handleCheckboxChange = (activitate: string) => {
        setFormData(prev => ({
            ...prev,
            activitati: prev.activitati.includes(activitate)
                ? prev.activitati.filter(a => a !== activitate)
                : [...prev.activitati, activitate]
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { errors, firstInvalidElement } = collectFormValidationErrors(e.currentTarget);
        setFieldErrors(errors);
        if (firstInvalidElement) {
            firstInvalidElement.focus();
            return;
        }
        setIsLoading(true);

        try {
            console.log("Form submitted:", formData);
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            setSubmitted(true);
            
            setTimeout(() => {
                setSubmitted(false);
                setFormData({
                    nume: "",
                    prenume: "",
                    email: "",
                    telefon: "",
                    varsta: "",
                    experienta: "",
                    disponibilitate: "",
                    activitati: [],
                    mesaj: ""
                });
                setFieldErrors({});
            }, 3000);
        } catch (error) {
            console.error("Error:", error);
            alert("A apărut o eroare. Te rugăm să încerci din nou.");
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            nume: "",
            prenume: "",
            email: "",
            telefon: "",
            varsta: "",
            experienta: "",
            disponibilitate: "",
            activitati: [],
            mesaj: ""
        });
        setFieldErrors({});
    };

    return (
        <div>
            {/* Hero Section */}
            <section className="voluntariatHero">
                <div className="voluntariatCloud vc1" />
                <div className="voluntariatCloud vc2" />
                <span className="voluntariatPaw vp1">🐾</span>
                <span className="voluntariatPaw vp2">🐾</span>
                <span className="voluntariatPaw vp3">🐾</span>
                <span
                    className="voluntariatPaw"
                    style={{ top: "30px", left: "130px", transform: "rotate(10deg)", fontSize: "20px" }}
                >
                    🐾
                </span>
                <span
                    className="voluntariatPaw"
                    style={{ bottom: "78px", right: "130px", transform: "rotate(-12deg)", fontSize: "22px" }}
                >
                    🐾
                </span>
                <div className="voluntariatHeroInner">
                    <h1 className="voluntariatTitle heroTitle">Voluntariat</h1>
                    <p className="voluntariatSub heroSubtitle">
                        Alătură-te echipei noastre și salvează vieți împreună
                    </p>
                </div>
            </section>

            {/* Info Section */}
            <section className="infoSection">
                <h2 className="sectionTitle">De ce să devii voluntar?</h2>
                <div className="infoGrid">
                    <div className="infoCard">
                        <div className="infoIcon">🌟</div>
                        <h3>Misiunea noastră</h3>
                        <p>
                            PawMate este dedicat salvării și îngrijirii animalelor abandonate.
                            Fiecare voluntar contribuie direct la oferirea unei șanse la viață
                            pentru animalele aflate în nevoie.
                        </p>
                    </div>
                    <div className="infoCard">
                        <div className="infoIcon">👥</div>
                        <h3>Comunitate unită</h3>
                        <p>
                            Vei face parte dintr-o echipă de oameni pasionați, care împărtășesc
                            aceeași dragoste pentru animale și dorința de a face bine.
                        </p>
                    </div>
                    <div className="infoCard">
                        <div className="infoIcon">📚</div>
                        <h3>Experiență valoroasă</h3>
                        <p>
                            Voluntariatul îți oferă oportunitatea de a învăța lucruri noi,
                            de a dezvolta abilități practice și de a acumula experiență utilă
                            pentru viitor.
                        </p>
                    </div>
                </div>
            </section>

            {/* Activități Section */}
            <section className="activitiesSection">
                <h2 className="sectionTitle">Activități de voluntariat</h2>
                <p className="sectionSubtitle">Alege domeniile care te pasionează</p>
                <div className="activityCards">
                    <div className="activityCard">
                        <div className="activityIcon">🐾</div>
                        <h3>Îngrijire animale</h3>
                        <p>Hrănirea, curățarea și îngrijirea zilnică a animalelor din adăpost</p>
                    </div>
                    <div className="activityCard">
                        <div className="activityIcon">🦮</div>
                        <h3>Plimbări cu câinii</h3>
                        <p>Plimbări regulate pentru socializare și exercițiu fizic</p>
                    </div>
                    <div className="activityCard">
                        <div className="activityIcon">🐱</div>
                        <h3>Socializare pisici</h3>
                        <p>Timp petrecut cu pisicile pentru a le ajuta să se obișnuiască cu oamenii</p>
                    </div>
                    <div className="activityCard">
                        <div className="activityIcon">📸</div>
                        <h3>Fotografie animale</h3>
                        <p>Fotografii profesionale pentru promovarea adopțiilor</p>
                    </div>
                    <div className="activityCard">
                        <div className="activityIcon">🎉</div>
                        <h3>Evenimente și campanii</h3>
                        <p>Organizare și participare la evenimente de strângere de fonduri</p>
                    </div>
                    <div className="activityCard">
                        <div className="activityIcon">🚗</div>
                        <h3>Transport animale</h3>
                        <p>Transport la veterinar sau la familii adoptive</p>
                    </div>
                    <div className="activityCard">
                        <div className="activityIcon">📱</div>
                        <h3>Social Media</h3>
                        <p>Gestionarea rețelelor sociale și promovare adopții</p>
                    </div>
                    <div className="activityCard">
                        <div className="activityIcon">📚</div>
                        <h3>Educație comunitate</h3>
                        <p>Workshopuri și prezentări despre îngrijirea responsabilă</p>
                    </div>
                </div>
            </section>

            {/* Beneficii Section */}
            <section className="benefitsSection">
                <h2 className="sectionTitle">Beneficiile voluntariatului</h2>
                <p className="sectionSubtitle">Ce câștigi devenind voluntar la PawMate</p>
                <div className="benefitsGrid">
                    <div className="benefitCard">
                        <div className="benefitIcon">❤️</div>
                        <h3>Face diferența</h3>
                        <p>Ajută animale nevinovate să găsească familii iubitoare și un cămin sigur</p>
                    </div>
                    <div className="benefitCard">
                        <div className="benefitIcon">🤝</div>
                        <h3>Comunitate</h3>
                        <p>Cunoști oameni minunați care împărtășesc aceeași pasiune pentru animale</p>
                    </div>
                    <div className="benefitCard">
                        <div className="benefitIcon">📜</div>
                        <h3>Certificare</h3>
                        <p>Primești certificat de voluntar și experiență valoroasă pentru CV</p>
                    </div>
                    <div className="benefitCard">
                        <div className="benefitIcon">🎓</div>
                        <h3>Învățare</h3>
                        <p>Dezvolți abilități noi în îngrijirea și comportamentul animalelor</p>
                    </div>
                    <div className="benefitCard">
                        <div className="benefitIcon">😊</div>
                        <h3>Fericire</h3>
                        <p>Bucuria de a vedea animale fericite, sănătoase și adoptate</p>
                    </div>
                    <div className="benefitCard">
                        <div className="benefitIcon">⏰</div>
                        <h3>Flexibilitate</h3>
                        <p>Program adaptat disponibilității tale, fără obligații stricte</p>
                    </div>
                </div>
            </section>

            {/* Formular Section */}
            <section className="formSection">
                <h2 className="sectionTitle">Înscrie-te ca voluntar</h2>
                <p className="sectionSubtitle">
                    Completează formularul și te vom contacta în cel mai scurt timp
                </p>

                {submitted && (
                    <div className="successMessage">
                        ✓ Mulțumim! Formularul a fost trimis cu succes. Te vom contacta în curând!
                    </div>
                )}

                <form onSubmit={handleSubmit} className="volunteerForm" noValidate>
                    <div className="formGrid">
                        <div className="formGroup">
                            <label htmlFor="nume">Nume *</label>
                            <input
                                type="text"
                                id="nume"
                                name="nume"
                                value={formData.nume}
                                onChange={handleInputChange}
                                required
                                placeholder="Popescu"
                                disabled={isLoading}
                                className={`formInput ${fieldErrors.nume ? "field-invalid" : ""}`}
                                aria-invalid={Boolean(fieldErrors.nume)}
                                aria-describedby={fieldErrors.nume ? "volunteer-nume-error" : undefined}
                            />
                            {fieldErrors.nume && (
                                <p className="validation-error" id="volunteer-nume-error">{fieldErrors.nume}</p>
                            )}
                        </div>

                        <div className="formGroup">
                            <label htmlFor="prenume">Prenume *</label>
                            <input
                                type="text"
                                id="prenume"
                                name="prenume"
                                value={formData.prenume}
                                onChange={handleInputChange}
                                required
                                placeholder="Ion"
                                disabled={isLoading}
                                className={`formInput ${fieldErrors.prenume ? "field-invalid" : ""}`}
                                aria-invalid={Boolean(fieldErrors.prenume)}
                                aria-describedby={fieldErrors.prenume ? "volunteer-prenume-error" : undefined}
                            />
                            {fieldErrors.prenume && (
                                <p className="validation-error" id="volunteer-prenume-error">{fieldErrors.prenume}</p>
                            )}
                        </div>

                        <div className="formGroup">
                            <label htmlFor="email">Email *</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                placeholder="ion.popescu@email.com"
                                disabled={isLoading}
                                className={`formInput ${fieldErrors.email ? "field-invalid" : ""}`}
                                aria-invalid={Boolean(fieldErrors.email)}
                                aria-describedby={fieldErrors.email ? "volunteer-email-error" : undefined}
                            />
                            {fieldErrors.email && (
                                <p className="validation-error" id="volunteer-email-error">{fieldErrors.email}</p>
                            )}
                        </div>

                        <div className="formGroup">
                            <label htmlFor="telefon">Telefon *</label>
                            <input
                                type="tel"
                                id="telefon"
                                name="telefon"
                                value={formData.telefon}
                                onChange={handleInputChange}
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
                            {fieldErrors.telefon && (
                                <p className="validation-error" id="volunteer-telefon-error">{fieldErrors.telefon}</p>
                            )}
                        </div>

                        <div className="formGroup">
                            <label htmlFor="varsta">Vârsta *</label>
                            <input
                                type="number"
                                id="varsta"
                                name="varsta"
                                value={formData.varsta}
                                onChange={handleInputChange}
                                required
                                min="16"
                                placeholder="18"
                                disabled={isLoading}
                                className={`formInput ${fieldErrors.varsta ? "field-invalid" : ""}`}
                                aria-invalid={Boolean(fieldErrors.varsta)}
                                aria-describedby={fieldErrors.varsta ? "volunteer-varsta-error" : undefined}
                            />
                            {fieldErrors.varsta && (
                                <p className="validation-error" id="volunteer-varsta-error">{fieldErrors.varsta}</p>
                            )}
                        </div>

                        <div className="formGroup">
                            <label htmlFor="disponibilitate">Disponibilitate *</label>
                            <select
                                id="disponibilitate"
                                name="disponibilitate"
                                value={formData.disponibilitate}
                                onChange={handleInputChange}
                                required
                                disabled={isLoading}
                                className={`formSelect ${fieldErrors.disponibilitate ? "field-invalid" : ""}`}
                                aria-invalid={Boolean(fieldErrors.disponibilitate)}
                                aria-describedby={fieldErrors.disponibilitate ? "volunteer-disponibilitate-error" : undefined}
                            >
                                <option value="">Alege opțiune</option>
                                <option value="weekend">Weekend</option>
                                <option value="săptămână">În timpul săptămânii</option>
                                <option value="ambele">Oricând</option>
                                <option value="occasional">Ocazional</option>
                            </select>
                            {fieldErrors.disponibilitate && (
                                <p className="validation-error" id="volunteer-disponibilitate-error">
                                    {fieldErrors.disponibilitate}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="formGroup">
                        <label htmlFor="experienta">Experiență cu animale</label>
                        <select
                            id="experienta"
                            name="experienta"
                            value={formData.experienta}
                            onChange={handleInputChange}
                            disabled={isLoading}
                            className="formSelect"
                        >
                            <option value="">Alege opțiune</option>
                            <option value="deloc">Fără experiență</option>
                            <option value="putin">Puțină experiență</option>
                            <option value="moderat">Experiență moderată</option>
                            <option value="mult">Multă experiență</option>
                            <option value="profesional">Profesional (veterinar, tehnician)</option>
                        </select>
                    </div>

                    <div className="formGroup">
                        <label>Activități de interes (selectează toate care te interesează)</label>
                        <div className="checkboxGrid">
                            {activitatiList.map((act) => (
                                <label key={act} className="checkboxLabel">
                                    <input
                                        type="checkbox"
                                        checked={formData.activitati.includes(act)}
                                        onChange={() => handleCheckboxChange(act)}
                                        disabled={isLoading}
                                    />
                                    <span>{act}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="formGroup">
                        <label htmlFor="mesaj">Spune-ne mai multe despre tine (opțional)</label>
                        <textarea
                            id="mesaj"
                            name="mesaj"
                            value={formData.mesaj}
                            onChange={handleInputChange}
                            rows={4}
                            placeholder="De ce vrei să devii voluntar? Ce te motivează?"
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
            </section>

            {/* FAQ Section */}
            <section className="faqSection">
                <h2 className="sectionTitle">Întrebări frecvente</h2>
                <p className="sectionSubtitle">Răspunsuri la cele mai comune întrebări</p>
                <div className="faqGrid">
                    <div className="faqCard">
                        <h3>❓ Trebuie să am experiență cu animale?</h3>
                        <p>
                            Nu este necesar! Oferim training complet pentru toți voluntarii noi.
                            Vei fi ghidat pas cu pas de echipa noastră experimentată.
                        </p>
                    </div>
                    <div className="faqCard">
                        <h3>⏰ Câte ore pe săptămână trebuie să ofer?</h3>
                        <p>
                            Programul este flexibil - chiar și 2-3 ore pe săptămână fac diferența!
                            Tu decizi când și cât timp poți oferi.
                        </p>
                    </div>
                    <div className="faqCard">
                        <h3>👶 Există vârstă minimă pentru voluntariat?</h3>
                        <p>
                            Tinerii între 16-18 ani pot participa cu acordul părinților.
                            Peste 18 ani, te poți înscrie independent.
                        </p>
                    </div>
                    <div className="faqCard">
                        <h3>💰 Sunt costuri asociate?</h3>
                        <p>
                            Nu, voluntariatul la PawMate este complet gratuit. Oferim tot
                            echipamentul necesar pentru activități.
                        </p>
                    </div>
                    <div className="faqCard">
                        <h3>🏥 Trebuie să am cunoștințe medicale?</h3>
                        <p>
                            Nu este necesar. Procedurile medicale sunt efectuate doar de veterinari.
                            Voluntarii ajută cu îngrijirea de bază.
                        </p>
                    </div>
                    <div className="faqCard">
                        <h3>📅 Cum arată procesul de înscriere?</h3>
                        <p>
                            După completarea formularului, te contactăm în 2-3 zile. Urmează o
                            întâlnire introductivă și un training de orientare.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
