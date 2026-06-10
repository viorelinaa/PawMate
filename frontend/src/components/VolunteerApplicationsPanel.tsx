import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppButton } from "./AppButton";
import {
    getMyVolunteerApplications,
    type VolunteerApplication,
    type VolunteerApplicationStatus,
} from "../services/volunteerService";

const statusLabels: Record<VolunteerApplicationStatus, string> = {
    pending: "In procesare",
    accepted: "Acceptata",
    rejected: "Respinsa",
};

function formatRequestDate(value?: string | null) {
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

function requestMessage(application: VolunteerApplication) {
    if (application.status === "accepted") {
        return "Cererea ta a fost acceptata. Verifica mesajul administratorului pentru urmatorii pasi.";
    }

    if (application.status === "rejected") {
        return "Cererea ta a fost respinsa. Detaliile deciziei sunt afisate mai jos.";
    }

    return "Cererea este in analiza. Vei primi raspunsul aici imediat ce un administrator o verifica.";
}

export function VolunteerApplicationsPanel() {
    const navigate = useNavigate();
    const [applications, setApplications] = useState<VolunteerApplication[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function loadApplications() {
            try {
                setLoading(true);
                const data = await getMyVolunteerApplications();
                if (isMounted) {
                    setApplications(data);
                    setError(null);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err instanceof Error ? err.message : "Nu s-au putut incarca cererile de voluntariat.");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        void loadApplications();

        return () => {
            isMounted = false;
        };
    }, []);

    if (loading) {
        return <p className="profile-placeholder">Se incarca cererile de voluntariat...</p>;
    }

    if (error) {
        return <div className="profile-feedback error">{error}</div>;
    }

    if (applications.length === 0) {
        return (
            <div className="profile-empty-state">
                <p className="profile-placeholder">Nu ai trimis inca nicio cerere de voluntariat.</p>
                <AppButton
                    type="button"
                    variant="primary"
                    size="md"
                    className="profile-btn profile-btn-primary"
                    onClick={() => navigate("/voluntariat")}
                >
                    Completeaza formularul
                </AppButton>
            </div>
        );
    }

    return (
        <div className="profile-request-list">
            {applications.map((application) => (
                <article key={application.id} className="profile-request-card profile-volunteer-card">
                    <div className="profile-request-media profile-volunteer-icon">
                        <span>V</span>
                    </div>

                    <div className="profile-request-body">
                        <div className="profile-request-header">
                            <div>
                                <p className="profile-activity-label">Cerere de voluntariat</p>
                                <h2 className="profile-activity-title">
                                    {application.firstName} {application.lastName}
                                </h2>
                            </div>
                            <span className={`profile-request-status ${application.status}`}>
                                {statusLabels[application.status]}
                            </span>
                        </div>

                        <div className="profile-request-meta-grid">
                            <span>{application.availability || "Disponibilitate nespecificata"}</span>
                            <span>{application.experience || "Experienta nespecificata"}</span>
                            <span>{formatRequestDate(application.createdAt)}</span>
                        </div>

                        {application.activities.length > 0 ? (
                            <div className="profile-request-applicant">
                                {application.activities.map((activity) => (
                                    <span key={activity}>{activity}</span>
                                ))}
                            </div>
                        ) : null}

                        <p className="profile-activity-copy">{requestMessage(application)}</p>

                        {application.message ? (
                            <p className="profile-request-note">Mesajul tau: {application.message}</p>
                        ) : null}

                        {application.adminComment ? (
                            <p className="profile-request-note">
                                Raspuns admin: {application.adminComment}
                            </p>
                        ) : null}

                        {application.reviewedAt ? (
                            <p className="profile-activity-meta">
                                Evaluata la {formatRequestDate(application.reviewedAt)}
                                {application.reviewedByAdminName ? ` de ${application.reviewedByAdminName}` : ""}
                            </p>
                        ) : null}
                    </div>
                </article>
            ))}
        </div>
    );
}
