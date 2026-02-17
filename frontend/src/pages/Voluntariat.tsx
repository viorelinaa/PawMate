import "./Voluntariat.css";

export default function Voluntariat() {
    return (
        <div>
            {/* Hero Section */}
            <section className="voluntariatHero">
                <div className="voluntariatCloud vc1" />
                <div className="voluntariatCloud vc2" />
                <span className="voluntariatPaw vp1">🐾</span>
                <span className="voluntariatPaw vp2">🐾</span>
                <span className="voluntariatPaw vp3">🐾</span>
                <div className="voluntariatHeroInner">
                    <h1 className="voluntariatTitle">Voluntariat</h1>
                    <p className="voluntariatSub">
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
        </div>
    );
}