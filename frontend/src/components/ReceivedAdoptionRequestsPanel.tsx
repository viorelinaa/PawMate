import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
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


type RequestStatusUpdateHandler = (id: number, status: Exclude<AdoptionStatus, "pending">) => Promise<void>;

function AdoptionRequestDetailsModal({
    request,
    updatingId,
    onClose,
    onStatusUpdate,
}: {
    request: AdoptionRequest;
    updatingId: number | null;
    onClose: () => void;
    onStatusUpdate: RequestStatusUpdateHandler;
}) {
    const imageUrl = getPetImageUrl(request.petImageUrl);
    const isUpdating = updatingId === request.id;

    return createPortal(
        <div className="modalOverlay profile-request-detail-overlay" onClick={onClose}>
            <div className="modalBox profile-request-detail-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modalHeader">
                    <div>
                        <p className="profile-activity-label">Cerere primita</p>
                        <h2 className="modalTitle">{request.petName}</h2>
                    </div>
                    <button className="modalClose" onClick={onClose} aria-label="Inchide">x</button>
                </div>

                <div className="profile-request-detail-layout">
                    <div className="profile-request-detail-media">
                        {imageUrl ? (
                            <img src={imageUrl} alt={`Poza cu ${request.petName}`} />
                        ) : (
                            <span>{request.petSpecies || "Animal"}</span>
                        )}
                    </div>

                    <div className="profile-request-detail-content">
                        <div className="profile-request-header">
                            <div className="profile-request-meta-grid">
                                <span>{request.petSpecies || "Specie necunoscuta"}</span>
                                <span>{request.petCity || "Oras necunoscut"}</span>
                                <span>Trimisa la {formatRequestDate(request.createdAt)}</span>
                            </div>
                            <span className={requestStatusClass(request.status)}>
                                {statusLabels[request.status]}
                            </span>
                        </div>

                        <section className="profile-request-detail-section">
                            <h3>Solicitant</h3>
                            <div className="profile-request-applicant">
                                <strong>{request.applicantName || request.applicantUserName || "Solicitant"}</strong>
                                <span>{request.applicantPhone || "Telefon indisponibil"}</span>
                                <span>{request.applicantEmail || "Email indisponibil"}</span>
                            </div>
                        </section>

                        <section className="profile-request-detail-section">
                            <h3>Detalii cerere</h3>
                            <div className="profile-request-detail-text">
                                <p><strong>Conditii de trai:</strong> {request.livingConditions || "Nu au fost completate."}</p>
                                <p><strong>Experienta:</strong> {request.animalExperience || "Nu a fost completata."}</p>
                                <p><strong>Mesaj:</strong> {request.message || "Nu a fost completat."}</p>
                            </div>
                        </section>

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
                                    size="md"
                                    className="profile-btn profile-btn-primary"
                                    disabled={isUpdating}
                                    onClick={() => onStatusUpdate(request.id, "accepted")}
                                >
                                    {isUpdating ? "Se salveaza..." : "Accepta"}
                                </AppButton>
                                <AppButton
                                    type="button"
                                    variant="ghost"
                                    size="md"
                                    className="profile-btn profile-request-reject-btn"
                                    disabled={isUpdating}
                                    onClick={() => onStatusUpdate(request.id, "rejected")}
                                >
                                    Respinge
                                </AppButton>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}

export function ReceivedAdoptionRequestsPanel() {
    const [requests, setRequests] = useState<AdoptionRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updatingId, setUpdatingId] = useState<number | null>(null);
    const [selectedRequest, setSelectedRequest] = useState<AdoptionRequest | null>(null);

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
            setSelectedRequest((prev) => (prev?.id === id ? updated : prev));
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
        <>
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

                            <div className="profile-request-actions">
                                <AppButton
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="profile-btn profile-btn-secondary"
                                    onClick={() => setSelectedRequest(request)}
                                >
                                    Vezi detalii
                                </AppButton>

                                {request.status === "pending" ? (
                                    <>
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
                                    </>
                                ) : null}
                            </div>
                        </div>
                    </article>
                );
            })}
        </div>
        {selectedRequest && (
            <AdoptionRequestDetailsModal
                request={selectedRequest}
                updatingId={updatingId}
                onClose={() => setSelectedRequest(null)}
                onStatusUpdate={handleStatusUpdate}
            />
        )}
        </>
    );
}