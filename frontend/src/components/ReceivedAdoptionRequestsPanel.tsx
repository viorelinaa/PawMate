import { useEffect, useState } from "react";
import { AppButton } from "./AppButton";
import {
    getReceivedAdoptionRequests,
    updateAdoptionRequestStatus,
    type AdoptionRequest,
    type AdoptionStatus,
} from "../services/adoptionService";
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

export function ReceivedAdoptionRequestsPanel() {
    const [requests, setRequests] = useState<AdoptionRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updatingId, setUpdatingId] = useState<number | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function loadRequests() {
            try {
                setLoading(true);
                const data = await getReceivedAdoptionRequests();
                if (isMounted) {
                    setRequests(data);
                    setError(null);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err instanceof Error ? err.message : "Nu s-au putut incarca cererile primite.");
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

    async function handleStatusUpdate(id: number, status: Exclude<AdoptionStatus, "pending">) {
        try {
            setUpdatingId(id);
            setError(null);
            const updated = await updateAdoptionRequestStatus(id, status);
            setRequests((prev) => prev.map((request) => (request.id === id ? updated : request)));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Nu s-a putut actualiza cererea.");
        } finally {
            setUpdatingId(null);
        }
    }

    if (loading) {
        return <p className="profile-placeholder">Se incarca cererile primite...</p>;
    }

    if (requests.length === 0 && !error) {
        return <p className="profile-placeholder">Nu ai cereri de adoptie primite momentan.</p>;
    }

    return (
        <div className="profile-request-list">
            {error && <div className="profile-feedback error">{error}</div>}

            {requests.map((request) => {
                const imageUrl = getPetImageUrl(request.petImageUrl);
                const isUpdating = updatingId === request.id;

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
                                    <p className="profile-activity-label">Cerere primita</p>
                                    <h2 className="profile-activity-title">{request.petName}</h2>
                                </div>
                                <span className={requestStatusClass(request.status)}>
                                    {statusLabels[request.status]}
                                </span>
                            </div>

                            <div className="profile-request-meta-grid">
                                <span>{request.petSpecies || "Specie necunoscuta"}</span>
                                <span>{request.petCity || "Oras necunoscut"}</span>
                                <span>Trimisa la {formatRequestDate(request.createdAt)}</span>
                            </div>

                            <div className="profile-request-applicant">
                                <strong>{request.applicantName || request.applicantUserName || "Solicitant"}</strong>
                                <span>{request.applicantPhone || "Telefon indisponibil"}</span>
                                <span>{request.applicantEmail || "Email indisponibil"}</span>
                            </div>

                            {request.livingConditions ? (
                                <p className="profile-request-note">Conditii de trai: {request.livingConditions}</p>
                            ) : null}

                            {request.animalExperience ? (
                                <p className="profile-request-note">Experienta: {request.animalExperience}</p>
                            ) : null}

                            {request.message ? (
                                <p className="profile-request-note">Mesaj: {request.message}</p>
                            ) : null}

                            {request.reviewedAt ? (
                                <p className="profile-activity-meta">
                                    Actualizata la {formatRequestDate(request.reviewedAt)}
                                </p>
                            ) : null}

                            {request.status === "pending" ? (
                                <div className="profile-request-actions">
                                    <AppButton
                                        type="button"
                                        variant="primary"
                                        size="sm"
                                        className="profile-btn profile-btn-primary"
                                        disabled={isUpdating}
                                        onClick={() => handleStatusUpdate(request.id, "accepted")}
                                    >
                                        {isUpdating ? "Se salveaza..." : "Accepta"}
                                    </AppButton>
                                    <AppButton
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="profile-btn profile-request-reject-btn"
                                        disabled={isUpdating}
                                        onClick={() => handleStatusUpdate(request.id, "rejected")}
                                    >
                                        Respinge
                                    </AppButton>
                                </div>
                            ) : null}
                        </div>
                    </article>
                );
            })}
        </div>
    );
}