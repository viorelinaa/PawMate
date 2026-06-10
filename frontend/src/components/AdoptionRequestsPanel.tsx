import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppButton } from "./AppButton";
import { getMyAdoptionRequests, type AdoptionRequest, type AdoptionStatus } from "../services/adoptionService";
import { getPetImageUrl } from "../services/petService";

const statusLabels: Record<AdoptionStatus, string> = {
    pending: "In asteptare",
    accepted: "Acceptata",
    rejected: "Respinsa",
};

function formatRequestDate(value: string) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return "data indisponibila";
    }

    return new Intl.DateTimeFormat("ro-RO", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(date);
}

function requestStatusClass(status: AdoptionStatus) {
    return `profile-request-status ${status}`;
}

function requestMessage(request: AdoptionRequest) {
    if (request.status === "accepted") {
        return "Cererea a fost acceptata. Proprietarul poate lua legatura cu tine.";
    }

    if (request.status === "rejected") {
        return "Cererea a fost respinsa. Poti trimite o alta cerere pentru un alt animal.";
    }

    return "Cererea asteapta raspuns de la proprietar sau administrator.";
}

export function AdoptionRequestsPanel() {
    const navigate = useNavigate();
    const [requests, setRequests] = useState<AdoptionRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function loadRequests() {
            try {
                setLoading(true);
                const data = await getMyAdoptionRequests();
                if (isMounted) {
                    setRequests(data);
                    setError(null);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err instanceof Error ? err.message : "Nu s-au putut incarca cererile de adoptie.");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        void loadRequests();

        return () => {
            isMounted = false;
        };
    }, []);

    if (loading) {
        return <p className="profile-placeholder">Se incarca cererile de adoptie...</p>;
    }

    if (error) {
        return <div className="profile-feedback error">{error}</div>;
    }

    if (requests.length === 0) {
        return (
            <div className="profile-empty-state">
                <p className="profile-placeholder">Nu ai trimis inca nicio cerere de adoptie.</p>
                <AppButton
                    type="button"
                    variant="primary"
                    size="md"
                    className="profile-btn profile-btn-primary"
                    onClick={() => navigate("/adoptie")}
                >
                    Vezi animale pentru adoptie
                </AppButton>
            </div>
        );
    }

    return (
        <div className="profile-request-list">
            {requests.map((request) => {
                const imageUrl = getPetImageUrl(request.petImageUrl);

                return (
                    <article key={request.id} className="profile-request-card">
                        <div className="profile-request-media">
                            {imageUrl ? (
                                <img src={imageUrl} alt={`Poza cu ${request.petName}`} loading="lazy" />
                            ) : (
                                <span>{request.petSpecies || "Animal"}</span>
                            )}
                        </div>

                        <div className="profile-request-body">
                            <div className="profile-request-header">
                                <div>
                                    <p className="profile-activity-label">Cerere trimisa</p>
                                    <h2 className="profile-activity-title">{request.petName}</h2>
                                </div>
                                <span className={requestStatusClass(request.status)}>
                                    {statusLabels[request.status]}
                                </span>
                            </div>

                            <div className="profile-request-meta-grid">
                                <span>{request.petSpecies || "Specie necunoscuta"}</span>
                                <span>{request.petCity || "Oras necunoscut"}</span>
                                <span>{formatRequestDate(request.createdAt)}</span>
                            </div>

                            <p className="profile-activity-copy">{requestMessage(request)}</p>

                            {request.message ? (
                                <p className="profile-request-note">Mesajul tau: {request.message}</p>
                            ) : null}

                            {request.reviewedAt ? (
                                <p className="profile-activity-meta">
                                    Actualizata la {formatRequestDate(request.reviewedAt)}
                                </p>
                            ) : null}
                        </div>
                    </article>
                );
            })}
        </div>
    );
}