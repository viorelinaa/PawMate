import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Veterinari.css";
import { AdminOnly } from "../components/AdminOnly";
import { SearchIcon } from "../components/SearchIcon";
import { AppButton } from "../components/AppButton";
import { AddActionButton } from "../components/AddActionButton";
import { FilterSelect } from "../components/FilterSelect";
import {
    AddVeterinaryClinicModal,
    DeleteVeterinaryClinicConfirmModal,
    EditVeterinaryClinicModal,
} from "../components/VeterinaryClinicModals";
import { getVeterinaryClinics, type VeterinaryClinic } from "../services/veterinaryClinicService";

function buildMapQuery(veterinar: VeterinaryClinic) {
    return [veterinar.address, veterinar.city, "Moldova"].filter(Boolean).join(", ");
}

function getLocationLabel(veterinar: VeterinaryClinic) {
    return veterinar.address || "Vezi locația pe hartă";
}

function getCoordinatesFromUrl(url: string) {
    const decodedUrl = decodeURIComponent(url);
    const patterns = [
        /@(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/,
        /!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/,
        /[?&]q=(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/
    ];

    for (const pattern of patterns) {
        const match = decodedUrl.match(pattern);
        if (match) {
            return `${match[1]},${match[2]}`;
        }
    }

    return null;
}

function buildGoogleMapsUrl(veterinar: VeterinaryClinic) {
    if (veterinar.googleMapsUrl) {
        return veterinar.googleMapsUrl;
    }

    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(buildMapQuery(veterinar))}`;
}

function buildAppleMapsUrl(veterinar: VeterinaryClinic) {
    if (veterinar.appleMapsUrl) {
        return veterinar.appleMapsUrl;
    }

    return `https://maps.apple.com/?q=${encodeURIComponent(veterinar.name)}&address=${encodeURIComponent(buildMapQuery(veterinar))}`;
}

function buildEmbeddedMapUrl(veterinar: VeterinaryClinic) {
    if (veterinar.mapEmbedUrl) {
        return veterinar.mapEmbedUrl;
    }

    const coordinates = veterinar.googleMapsUrl ? getCoordinatesFromUrl(veterinar.googleMapsUrl) : null;
    if (coordinates) {
        return `https://www.google.com/maps?q=${encodeURIComponent(coordinates)}&z=17&output=embed`;
    }

    if (veterinar.googleMapsUrl && !veterinar.address) {
        return `https://www.google.com/maps?q=${encodeURIComponent(veterinar.googleMapsUrl)}&output=embed`;
    }

    return `https://www.google.com/maps?q=${encodeURIComponent(buildMapQuery(veterinar))}&output=embed`;
}

function VeterinarMapModal({ veterinar, onClose }: { veterinar: VeterinaryClinic; onClose: () => void }) {
    return (
        <div className="modalOverlay vetMapOverlay" onClick={onClose}>
            <div
                className="modalBox vetMapModal"
                role="dialog"
                aria-modal="true"
                aria-labelledby={`vet-map-title-${veterinar.id}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modalHeader vetMapHeader">
                    <div>
                        <h2 className="modalTitle" id={`vet-map-title-${veterinar.id}`}>
                            {veterinar.name}
                        </h2>
                        <p className="vetMapAddress">
                            {getLocationLabel(veterinar)}, {veterinar.city}
                        </p>
                    </div>
                    <button type="button" className="modalClose" onClick={onClose} aria-label="Închide harta">
                        ✕
                    </button>
                </div>

                <div className="vetMapBody">
                    <div className="vetMapCanvas">
                        <iframe
                            className="vetMapFrame"
                            title={`Harta pentru ${veterinar.name}`}
                            src={buildEmbeddedMapUrl(veterinar)}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>

                    <div className="vetMapActions">
                        <a
                            className="vetMapAction vetMapActionPrimary"
                            href={buildGoogleMapsUrl(veterinar)}
                            target="_blank"
                            rel="noreferrer"
                        >
                            Deschide în Google Maps
                        </a>
                        <a
                            className="vetMapAction vetMapActionSecondary"
                            href={buildAppleMapsUrl(veterinar)}
                            target="_blank"
                            rel="noreferrer"
                        >
                            Deschide în Apple Maps
                        </a>
                    </div>

                    <p className="vetMapHint">Apasă în afara ferestrei sau tasta Escape pentru închidere.</p>
                </div>
            </div>
        </div>
    );
}

function VeterinarCard({
    v,
    onOpenMap,
    onEdit,
    onDelete,
}: {
    v: VeterinaryClinic;
    onOpenMap: (veterinar: VeterinaryClinic) => void;
    onEdit: (veterinar: VeterinaryClinic) => void;
    onDelete: (veterinar: VeterinaryClinic) => void;
}) {
    return (
        <div className="vetCard">
            <div className="vetCardHeader">
                <div>
                    <h3 className="vetName">{v.name}</h3>
                    <span className="vetCity">{v.city}</span>
                </div>
                {v.emergency && <span className="emergencyBadge">Urgențe 24/7</span>}
            </div>
            <button type="button" className="vetAddressLink" onClick={() => onOpenMap(v)}>
                📍 {getLocationLabel(v)}
            </button>
            <p className="vetPhone">📞 {v.phone}</p>
            <div className="services">
                {v.services.map((service) => (
                    <span key={service} className="serviceBadge">
                        {service}
                    </span>
                ))}
            </div>
            <p className="vetDesc">{v.description}</p>
            <AppButton className="btnContact" variant="primary" onClick={() => alert(`Sună la ${v.phone}`)}>
                Contactează
            </AppButton>
            <AdminOnly>
                <div className="vetAdminActions">
                    <AppButton
                        className="vetEditButton"
                        variant="ghost"
                        onClick={() => onEdit(v)}
                        fullWidth
                    >
                        Editează clinica
                    </AppButton>
                    <AppButton
                        className="vetDeleteButton"
                        variant="ghost"
                        onClick={() => onDelete(v)}
                        fullWidth
                    >
                        Șterge clinica
                    </AppButton>
                </div>
            </AdminOnly>
        </div>
    );
}

export default function Veterinari() {
    const location = useLocation();
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [city, setCity] = useState("ALL");
    const [onlyEmergency, setOnlyEmergency] = useState(false);
    const [selectedVeterinar, setSelectedVeterinar] = useState<VeterinaryClinic | null>(null);
    const [editClinicTarget, setEditClinicTarget] = useState<VeterinaryClinic | null>(null);
    const [deleteClinicTarget, setDeleteClinicTarget] = useState<VeterinaryClinic | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [veterinariList, setVeterinariList] = useState<VeterinaryClinic[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        if (searchParams.get("add") !== "clinic") {
            return;
        }

        setShowAddModal(true);
        searchParams.delete("add");

        const nextSearch = searchParams.toString();
        navigate(
            {
                pathname: location.pathname,
                search: nextSearch ? `?${nextSearch}` : "",
            },
            { replace: true }
        );
    }, [location.pathname, location.search, navigate]);

    useEffect(() => {
        if (!selectedVeterinar && !showAddModal && !editClinicTarget && !deleteClinicTarget) {
            return;
        }

        const previousOverflow = document.body.style.overflow;
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setSelectedVeterinar(null);
                setShowAddModal(false);
                setEditClinicTarget(null);
                setDeleteClinicTarget(null);
            }
        };

        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [selectedVeterinar, showAddModal, editClinicTarget, deleteClinicTarget]);

    async function loadVeterinaryClinics() {
        try {
            setIsLoading(true);
            const data = await getVeterinaryClinics();
            setVeterinariList(data);
            setLoadError(null);
        } catch (error) {
            setLoadError(
                error instanceof Error
                    ? error.message
                    : "Nu s-au putut încărca clinicile veterinare."
            );
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        void loadVeterinaryClinics();
    }, []);

    const allCities = [...new Set(veterinariList.map((v) => v.city))].sort((a, b) => a.localeCompare(b, "ro"));

    const filtered = veterinariList.filter((v) => {
        if (city !== "ALL" && v.city !== city) return false;
        if (onlyEmergency && !v.emergency) return false;
        if (query) {
            const q = query.toLowerCase();
            if (
                !v.name.toLowerCase().includes(q) &&
                !v.description.toLowerCase().includes(q) &&
                !v.address.toLowerCase().includes(q) &&
                !v.services.some((service) => service.toLowerCase().includes(q))
            ) {
                return false;
            }
        }
        return true;
    });

    function resetFilters() {
        setQuery("");
        setCity("ALL");
        setOnlyEmergency(false);
    }

    function handleClinicUpdated(updatedClinic: VeterinaryClinic) {
        setVeterinariList((prev) =>
            prev.map((clinic) => (clinic.id === updatedClinic.id ? updatedClinic : clinic))
        );
        void loadVeterinaryClinics();
    }

    return (
        <div className="veterinariPage">
            <section className="veterinariHero">
                <div className="veterinariCloud vc1" />
                <div className="veterinariCloud vc2" />
                <span className="veterinariPaw vp1">🐾</span>
                <span className="veterinariPaw vp2">🐾</span>
                <span className="veterinariPaw vp3">🐾</span>
                <span
                    className="veterinariPaw"
                    style={{ top: "30px", left: "130px", transform: "rotate(12deg)", fontSize: "20px" }}
                >
                    🐾
                </span>
                <span
                    className="veterinariPaw"
                    style={{ bottom: "78px", right: "130px", transform: "rotate(-10deg)", fontSize: "22px" }}
                >
                    🐾
                </span>
                <div className="veterinariHeroInner">
                    <h1 className="veterinariTitle heroTitle">Veterinari</h1>
                    <p className="veterinariSub heroSubtitle">Găsește clinici veterinare din apropiere.</p>
                </div>
            </section>

            <AdminOnly>
                <div className="roleActionBar">
                    <AddActionButton
                        label="Adaugă clinică"
                        onClick={() => setShowAddModal(true)}
                    />
                </div>
            </AdminOnly>

            {showAddModal && (
                <AddVeterinaryClinicModal
                    onClose={() => setShowAddModal(false)}
                    onAdded={loadVeterinaryClinics}
                />
            )}

            {deleteClinicTarget && (
                <DeleteVeterinaryClinicConfirmModal
                    clinic={deleteClinicTarget}
                    onClose={() => setDeleteClinicTarget(null)}
                    onDeleted={loadVeterinaryClinics}
                />
            )}

            {editClinicTarget && (
                <EditVeterinaryClinicModal
                    clinic={editClinicTarget}
                    onClose={() => setEditClinicTarget(null)}
                    onUpdated={handleClinicUpdated}
                />
            )}

            <div className="veterinariContent">
                <div className="filters">
                    <div className="filtersGrid">
                        <div className="searchField">
                            <SearchIcon size={18} aria-hidden="true" />
                            <input
                                className="filterInput"
                                placeholder="Caută după nume, adresă sau servicii..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </div>
                        <FilterSelect className="filterSelect" value={city} onChange={(e) => setCity(e.target.value)}>
                            <option value="ALL">Toate orașele</option>
                            {allCities.map((c) => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                            ))}
                        </FilterSelect>
                        <label className="filterCheck">
                            <input
                                type="checkbox"
                                checked={onlyEmergency}
                                onChange={(e) => setOnlyEmergency(e.target.checked)}
                            />
                            Doar urgențe 24/7
                        </label>
                        <AppButton className="btnReset" variant="ghost" onClick={resetFilters}>
                            Reset filtre
                        </AppButton>
                    </div>
                </div>

                {isLoading && <div className="emptyNotice">Se încarcă clinicile veterinare...</div>}
                {loadError && !isLoading && <div className="emptyNotice vetLoadError">{loadError}</div>}

                {!isLoading && !loadError && filtered.length > 0 ? (
                    <div className="vetCards">
                        {filtered.map((v) => (
                            <VeterinarCard
                                key={v.id}
                                v={v}
                                onOpenMap={setSelectedVeterinar}
                                onEdit={setEditClinicTarget}
                                onDelete={setDeleteClinicTarget}
                            />
                        ))}
                    </div>
                ) : null}

                {!isLoading && !loadError && filtered.length === 0 ? (
                    <div className="emptyNotice">Nu există rezultate pentru filtrele selectate.</div>
                ) : null}
            </div>

            {selectedVeterinar && (
                <VeterinarMapModal veterinar={selectedVeterinar} onClose={() => setSelectedVeterinar(null)} />
            )}
        </div>
    );
}
