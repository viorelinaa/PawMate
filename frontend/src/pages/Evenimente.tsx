import { useState, useEffect } from "react";
import "../styles/Evenimente.css";
import { AdminOnly } from "../components/AdminOnly";
import { SearchIcon } from "../components/SearchIcon";
import { AppButton } from "../components/AppButton";
import { AddActionButton } from "../components/AddActionButton";
import { FilterSelect } from "../components/FilterSelect";
import {
    getEvents,
    AddEventModal,
    EditEventModal,
    DeleteEventModal,
    EventCard,
} from "../components/EventModals";
import type { EventItem } from "../services/eventService";

export default function Evenimente() {
    const [events, setEvents] = useState<EventItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editEvent, setEditEvent] = useState<EventItem | null>(null);
    const [deleteEvent, setDeleteEvent] = useState<EventItem | null>(null);
    const [query, setQuery] = useState("");
    const [location, setLocation] = useState("ALL");

    async function loadEvents() {
        try {
            setIsLoading(true);
            const data = await getEvents();
            setEvents(data);
            setLoadError(null);
        } catch {
            setLoadError("Nu s-au putut încărca evenimentele. Verifică conexiunea la server.");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        void loadEvents();
    }, []);

    const allLocations = [...new Set(events.map((e) => e.location).filter(Boolean))];

    const filtered = events.filter((e) => {
        if (location !== "ALL" && e.location !== location) return false;
        if (query) {
            const q = query.toLowerCase();
            if (
                !e.title.toLowerCase().includes(q) &&
                !e.description?.toLowerCase().includes(q)
            )
                return false;
        }
        return true;
    });

    function resetFilters() {
        setQuery("");
        setLocation("ALL");
    }

    return (
        <div className="eventsPage">
            <section className="eventsHero">
                <div className="eventsCloud ec1" />
                <div className="eventsCloud ec2" />
                <span className="eventsPaw ep1">🐾</span>
                <span className="eventsPaw ep2">🐾</span>
                <span className="eventsPaw ep3">🐾</span>
                <span
                    className="eventsPaw"
                    style={{ top: "30px", left: "130px", transform: "rotate(10deg)", fontSize: "20px" }}
                >
                    🐾
                </span>
                <span
                    className="eventsPaw"
                    style={{ bottom: "78px", right: "130px", transform: "rotate(-12deg)", fontSize: "22px" }}
                >
                    🐾
                </span>
                <div className="eventsHeroInner">
                    <h1 className="eventsTitle heroTitle">Evenimente</h1>
                    <p className="eventsSubtitle heroSubtitle">Târguri, întâlniri, acțiuni de voluntariat.</p>
                </div>
            </section>

            <AdminOnly>
                <div className="roleActionBar">
                    <AddActionButton
                        label="Adaugă eveniment"
                        onClick={() => setShowAddModal(true)}
                    />
                </div>
            </AdminOnly>

            {showAddModal && (
                <AddEventModal onClose={() => setShowAddModal(false)} onAdded={loadEvents} />
            )}
            {editEvent && (
                <EditEventModal
                    event={editEvent}
                    onClose={() => setEditEvent(null)}
                    onUpdated={loadEvents}
                />
            )}
            {deleteEvent && (
                <DeleteEventModal
                    event={deleteEvent}
                    onClose={() => setDeleteEvent(null)}
                    onDeleted={() => {
                        void loadEvents();
                    }}
                />
            )}

            <section className="eventsContent">
                <div className="eventsFilters">
                    <div className="eventsFiltersGrid">
                        <div className="searchField">
                            <SearchIcon size={18} aria-hidden="true" />
                            <input
                                className="filterInput"
                                placeholder="Caută după titlu..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </div>
                        <FilterSelect
                            className="filterSelect"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        >
                            <option value="ALL">Toate locațiile</option>
                            {allLocations.map((loc) => (
                                <option key={loc} value={loc}>
                                    {loc}
                                </option>
                            ))}
                        </FilterSelect>
                        <AppButton className="btnReset" variant="ghost" onClick={resetFilters}>
                            Reset filtre
                        </AppButton>
                    </div>
                </div>

                {isLoading && <div className="eventsEmpty">Se încarcă evenimentele...</div>}
                {loadError && <div className="eventsEmpty" style={{ color: "red" }}>{loadError}</div>}

                {!isLoading && !loadError && filtered.length === 0 && (
                    <div className="eventsEmpty">Nu există evenimente pentru filtrele selectate.</div>
                )}

                {!isLoading && !loadError && filtered.length > 0 && (
                    <div className="eventsGrid">
                        {filtered.map((event) => (
                            <EventCard
                                key={event.id}
                                event={event}
                                onEdit={setEditEvent}
                                onDelete={setDeleteEvent}
                            />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
