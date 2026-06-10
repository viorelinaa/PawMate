import { useEffect, useMemo, useState } from "react";
import {
    getVolunteerApplicationsForAdmin,
    reviewVolunteerApplication,
    type VolunteerApplication,
    type VolunteerApplicationStatus,
} from "../services/volunteerService";
import "../styles/AdminVolunteerApplications.css";

const statusLabels: Record<VolunteerApplicationStatus, string> = {
    pending: "In asteptare",
    accepted: "Acceptata",
    rejected: "Respinsa",
};

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

function fullName(application: VolunteerApplication) {
    return `${application.firstName} ${application.lastName}`.trim() || application.userName || "Voluntar";
}

export default function AdminVolunteerApplications() {
    const [applications, setApplications] = useState<VolunteerApplication[]>([]);
    const [comments, setComments] = useState<Record<number, string>>({});
    const [loading, setLoading] = useState(true);
    const [savingId, setSavingId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const stats = useMemo(() => {
        return applications.reduce(
            (acc, application) => {
                acc.total += 1;
                acc[application.status] += 1;
                return acc;
            },
            { total: 0, pending: 0, accepted: 0, rejected: 0 }
        );
    }, [applications]);

    async function loadApplications() {
        try {
            setLoading(true);
            const data = await getVolunteerApplicationsForAdmin();
            setApplications(data);
            setComments(
                data.reduce<Record<number, string>>((acc, application) => {
                    acc[application.id] = application.adminComment ?? "";
                    return acc;
                }, {})
            );
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Nu s-au putut incarca cererile.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        void loadApplications();
    }, []);

    async function handleDecision(id: number, status: Exclude<VolunteerApplicationStatus, "pending">) {
        const adminComment = (comments[id] ?? "").trim();

        if (!adminComment) {
            setError("Scrie un comentariu inainte de a salva decizia.");
            setSuccess(null);
            return;
        }

        try {
            setSavingId(id);
            const updated = await reviewVolunteerApplication(id, { status, adminComment });
            setApplications((prev) =>
                prev
                    .map((application) => (application.id === id ? updated : application))
                    .sort((a, b) => {
                        if (a.status === "pending" && b.status !== "pending") return -1;
                        if (a.status !== "pending" && b.status === "pending") return 1;
                        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                    })
            );
            setComments((prev) => ({ ...prev, [id]: updated.adminComment }));
            setError(null);
            setSuccess(status === "accepted" ? "Cererea a fost acceptata." : "Cererea a fost respinsa.");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Nu s-a putut salva decizia.");
            setSuccess(null);
        } finally {
            setSavingId(null);
        }
    }

    return (
        <div className="adminVolunteer">
            <header className="adminVolunteerHeader">
                <div>
                    <p className="adminVolunteerKicker">Voluntariat</p>
                    <h1>Cereri de voluntariat</h1>
                    <p>Verifica fiecare cerere, lasa un comentariu si alege daca voluntarul este acceptat.</p>
                </div>
                <button type="button" className="adminVolunteerRefresh" onClick={loadApplications} disabled={loading}>
                    {loading ? "Se incarca..." : "Reincarca"}
                </button>
            </header>

            <section className="adminVolunteerStats" aria-label="Statistici cereri voluntariat">
                <div className="adminVolunteerStat">
                    <span>Total</span>
                    <strong>{stats.total}</strong>
                </div>
                <div className="adminVolunteerStat">
                    <span>In asteptare</span>
                    <strong>{stats.pending}</strong>
                </div>
                <div className="adminVolunteerStat">
                    <span>Acceptate</span>
                    <strong>{stats.accepted}</strong>
                </div>
                <div className="adminVolunteerStat">
                    <span>Respinse</span>
                    <strong>{stats.rejected}</strong>
                </div>
            </section>

            {error ? <div className="adminVolunteerFeedback adminVolunteerFeedbackError">{error}</div> : null}
            {success ? <div className="adminVolunteerFeedback adminVolunteerFeedbackSuccess">{success}</div> : null}

            {loading ? (
                <div className="adminVolunteerState">Se incarca cererile de voluntariat...</div>
            ) : applications.length === 0 ? (
                <div className="adminVolunteerState">Nu exista cereri de voluntariat momentan.</div>
            ) : (
                <section className="adminVolunteerList">
                    {applications.map((application) => {
                        const isPending = application.status === "pending";
                        const isSaving = savingId === application.id;

                        return (
                            <article key={application.id} className="adminVolunteerCard">
                                <div className="adminVolunteerCardHeader">
                                    <div>
                                        <p className="adminVolunteerLabel">Cerere #{application.id}</p>
                                        <h2>{fullName(application)}</h2>
                                    </div>
                                    <span className={`adminVolunteerStatus adminVolunteerStatus--${application.status}`}>
                                        {statusLabels[application.status]}
                                    </span>
                                </div>

                                <div className="adminVolunteerMeta">
                                    <span>{application.email}</span>
                                    <span>{application.phone}</span>
                                    <span>{application.age} ani</span>
                                    <span>Trimisa la {formatDate(application.createdAt)}</span>
                                </div>

                                <div className="adminVolunteerDetails">
                                    <p><strong>Disponibilitate:</strong> {application.availability || "Nespecificata"}</p>
                                    <p><strong>Experienta:</strong> {application.experience || "Nespecificata"}</p>
                                    <p><strong>Mesaj:</strong> {application.message || "Fara mesaj suplimentar."}</p>
                                </div>

                                {application.activities.length > 0 ? (
                                    <div className="adminVolunteerActivities">
                                        {application.activities.map((activity) => (
                                            <span key={activity}>{activity}</span>
                                        ))}
                                    </div>
                                ) : null}

                                <label className="adminVolunteerComment">
                                    Comentariu admin
                                    <textarea
                                        value={comments[application.id] ?? ""}
                                        onChange={(event) =>
                                            setComments((prev) => ({
                                                ...prev,
                                                [application.id]: event.target.value,
                                            }))
                                        }
                                        placeholder="Scrie motivul deciziei sau pasii urmatori pentru user..."
                                        disabled={!isPending || isSaving}
                                        rows={4}
                                    />
                                </label>

                                {application.reviewedAt ? (
                                    <p className="adminVolunteerReviewed">
                                        Evaluata la {formatDate(application.reviewedAt)}
                                        {application.reviewedByAdminName ? ` de ${application.reviewedByAdminName}` : ""}
                                    </p>
                                ) : null}

                                <div className="adminVolunteerActions">
                                    {isPending ? (
                                        <>
                                            <button
                                                type="button"
                                                className="adminVolunteerBtn adminVolunteerBtnAccept"
                                                onClick={() => handleDecision(application.id, "accepted")}
                                                disabled={isSaving}
                                            >
                                                {isSaving ? "Se salveaza..." : "Accepta"}
                                            </button>
                                            <button
                                                type="button"
                                                className="adminVolunteerBtn adminVolunteerBtnReject"
                                                onClick={() => handleDecision(application.id, "rejected")}
                                                disabled={isSaving}
                                            >
                                                {isSaving ? "Se salveaza..." : "Respinge"}
                                            </button>
                                        </>
                                    ) : (
                                        <span className="adminVolunteerLocked">Decizie salvata</span>
                                    )}
                                </div>
                            </article>
                        );
                    })}
                </section>
            )}
        </div>
    );
}
