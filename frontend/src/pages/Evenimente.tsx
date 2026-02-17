import { useState } from "react";
import "../styles/Evenimente.css";

type Event = {
    id: string;
    city: string;
    date: string;
    title: string;
    description: string;
    type: string;
};

const events: Event[] = [
    {
        id: "e1",
        city: "Chișinău",
        date: "2026-03-02",
        title: "Târg de adopții",
        description: "Adopții + consiliere + donații.",
        type: "Adopții",
    },
    {
        id: "e2",
        city: "Bălți",
        date: "2026-02-25",
        title: "Zi de voluntariat la adăpost",
        description: "Curățenie, plimbări, socializare.",
        type: "Voluntariat",
    },
    {
        id: "e3",
        city: "Cahul",
        date: "2026-03-10",
        title: "Campanie de vaccinare și microcipare",
        description: "Consultații rapide, recomandări și vaccinuri de bază.",
        type: "Campanie medicală",
    },
    {
        id: "e4",
        city: "Orhei",
        date: "2026-03-16",
        title: "Atelier de dresaj pentru căței",
        description: "Comenzi de bază, jocuri și socializare controlată.",
        type: "Atelier",
    },
    {
        id: "e5",
        city: "Soroca",
        date: "2026-03-22",
        title: "Întâlnire de socializare pentru pisici",
        description: "Joacă, schimb de sfaturi și adopții responsabile.",
        type: "Socializare",
    },
    {
        id: "e6",
        city: "Ungheni",
        date: "2026-03-28",
        title: "Piață de donații pentru adăposturi",
        description: "Hrană, pături, jucării și accesoriile de care e nevoie.",
        type: "Donații",
    },
    {
        id: "e7",
        city: "Chișinău",
        date: "2026-04-03",
        title: "Marș caritabil cu căței",
        description: "Strângere de fonduri pentru îngrijire și tratamente.",
        type: "Caritabil",
    },
    {
        id: "e8",
        city: "Hîncești",
        date: "2026-04-09",
        title: "Zi de grooming gratuit",
        description: "Tuns, spălat și îngrijire blană (locuri limitate).",
        type: "Îngrijire",
    },
];

const allCities = [...new Set(events.map((event) => event.city))];
const allTypes = [...new Set(events.map((event) => event.type))];

export default function Evenimente() {
    const [query, setQuery] = useState("");
    const [city, setCity] = useState("ALL");
    const [eventType, setEventType] = useState("ALL");

    const filtered = events.filter((event) => {
        if (city !== "ALL" && event.city !== city) return false;
        if (eventType !== "ALL" && event.type !== eventType) return false;
        if (query) {
            const q = query.toLowerCase();
            if (
                !event.title.toLowerCase().includes(q) &&
                !event.description.toLowerCase().includes(q)
            )
                return false;
        }
        return true;
    });

    function resetFilters() {
        setQuery("");
        setCity("ALL");
        setEventType("ALL");
    }

    return (
        <div className="eventsPage">
            <section className="eventsHero">
                <div className="eventsCloud ec1" />
                <div className="eventsCloud ec2" />
                <span className="eventsPaw ep1">🐾</span>
                <span className="eventsPaw ep2">🐾</span>
                <span className="eventsPaw ep3">🐾</span>
                <div className="eventsHeroInner">
                    <h1 className="eventsTitle">Evenimente</h1>
                    <p className="eventsSubtitle">Târguri, întâlniri, acțiuni de voluntariat.</p>
                </div>
            </section>

            <section className="eventsContent">
                <div className="eventsFilters">
                    <div className="eventsFiltersGrid">
                        <input
                            className="filterInput"
                            placeholder="Caută după titlu..."
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                        />
                        <select
                            className="filterSelect"
                            value={city}
                            onChange={(event) => setCity(event.target.value)}
                        >
                            <option value="ALL">Toate orașele</option>
                            {allCities.map((entry) => (
                                <option key={entry} value={entry}>
                                    {entry}
                                </option>
                            ))}
                        </select>
                        <select
                            className="filterSelect"
                            value={eventType}
                            onChange={(event) => setEventType(event.target.value)}
                        >
                            <option value="ALL">Toate tipurile</option>
                            {allTypes.map((entry) => (
                                <option key={entry} value={entry}>
                                    {entry}
                                </option>
                            ))}
                        </select>
                        <button className="btnReset" onClick={resetFilters}>
                            Reset filtre
                        </button>
                    </div>
                </div>

                {filtered.length > 0 ? (
                    <div className="eventsGrid">
                        {filtered.map((event) => (
                            <article className="eventsCard" key={event.id}>
                                <div className="eventsCardTop">
                                    <span className="eventsCity">{event.city}</span>
                                    <span className="eventsDate">{event.date}</span>
                                </div>
                                <h3 className="eventsName">{event.title}</h3>
                                <div className="eventsTags">
                                    <span className="eventsTag">{event.type}</span>
                                </div>
                                <p className="eventsDesc">{event.description}</p>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="eventsEmpty">
                        Nu există evenimente pentru filtrele selectate.
                    </div>
                )}
            </section>
        </div>
    );
}
