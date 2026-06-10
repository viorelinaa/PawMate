import { useEffect, useMemo, useState } from "react";
import {
    getWithdrawalRequestsForAdmin,
    reviewWithdrawalRequest,
    type WithdrawalRequest,
    type WithdrawalStatus,
} from "../services/walletService";
import "../styles/Wallet.css";

const statusLabels: Record<WithdrawalStatus, string> = {
    pending: "In asteptare",
    approved: "Aprobata",
    rejected: "Respinsa",
};

function formatMoney(value: number) {
    return `${Number(value).toFixed(2)} MDL`;
}

function formatDate(value?: string | null) {
    if (!value) return "data indisponibila";
    return new Intl.DateTimeFormat("ro-RO", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(value));
}

export default function AdminWithdrawals() {
    const [requests, setRequests] = useState<WithdrawalRequest[]>([]);
    const [comments, setComments] = useState<Record<number, string>>({});
    const [loading, setLoading] = useState(true);
    const [savingId, setSavingId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const stats = useMemo(
        () =>
            requests.reduce(
                (acc, request) => {
                    acc.total += request.amount;
                    acc[request.status] += request.amount;
                    return acc;
                },
                { total: 0, pending: 0, approved: 0, rejected: 0 }
            ),
        [requests]
    );

    async function loadRequests() {
        try {
            setLoading(true);
            const data = await getWithdrawalRequestsForAdmin();
            setRequests(data);
            setComments(
                data.reduce<Record<number, string>>((acc, request) => {
                    acc[request.id] = request.adminComment ?? "";
                    return acc;
                }, {})
            );
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Nu s-au putut incarca retragerile.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        void loadRequests();
    }, []);

    async function handleDecision(id: number, status: "approved" | "rejected") {
        const adminComment = (comments[id] ?? "").trim();
        if (status === "rejected" && !adminComment) {
            setError("Scrie motivul respingerii inainte de a continua.");
            setSuccess(null);
            return;
        }

        try {
            setSavingId(id);
            const updated = await reviewWithdrawalRequest(id, { status, adminComment });
            setRequests((prev) =>
                prev
                    .map((request) => (request.id === id ? updated : request))
                    .sort((a, b) => {
                        if (a.status === "pending" && b.status !== "pending") return -1;
                        if (a.status !== "pending" && b.status === "pending") return 1;
                        return new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime();
                    })
            );
            setSuccess(status === "approved" ? "Retragerea sandbox a fost aprobata." : "Retragerea a fost respinsa.");
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Nu s-a putut procesa retragerea.");
            setSuccess(null);
        } finally {
            setSavingId(null);
        }
    }

    return (
        <div className="walletPage">
            <header className="walletHeader">
                <div>
                    <p className="walletKicker">Administrare Sandbox</p>
                    <h1>Cereri de retragere</h1>
                    <p>Aproba sau respinge retragerile simulate solicitate de vanzatori.</p>
                </div>
                <button type="button" className="walletRefresh" onClick={loadRequests} disabled={loading}>
                    {loading ? "Se incarca..." : "Reincarca"}
                </button>
            </header>

            <section className="walletStats">
                <article className="walletStat"><span>Total solicitat</span><strong>{formatMoney(stats.total)}</strong></article>
                <article className="walletStat"><span>In asteptare</span><strong>{formatMoney(stats.pending)}</strong></article>
                <article className="walletStat"><span>Aprobat</span><strong>{formatMoney(stats.approved)}</strong></article>
                <article className="walletStat"><span>Respins</span><strong>{formatMoney(stats.rejected)}</strong></article>
            </section>

            {error ? <div className="walletFeedback walletFeedbackError">{error}</div> : null}
            {success ? <div className="walletFeedback walletFeedbackSuccess">{success}</div> : null}

            {loading ? (
                <div className="walletState">Se incarca cererile de retragere...</div>
            ) : requests.length === 0 ? (
                <div className="walletState">Nu exista cereri de retragere.</div>
            ) : (
                <section className="walletAdminList">
                    {requests.map((request) => {
                        const isPending = request.status === "pending";
                        const isSaving = savingId === request.id;

                        return (
                            <article key={request.id} className="walletAdminCard">
                                <div className="walletAdminTop">
                                    <div>
                                        <p>Cerere #{request.id}</p>
                                        <h2>{request.sellerName || `Vanzator #${request.sellerId}`}</h2>
                                        <span>{request.sellerEmail}</span>
                                        <span className="walletAdminDestination">
                                            Cont PayPal Sandbox: {request.destinationPayPalEmail || "neconfigurat"}
                                        </span>
                                    </div>
                                    <div className="walletAdminAmount">
                                        <strong>{formatMoney(request.amount)}</strong>
                                        <span className={`walletStatus walletStatus--${request.status}`}>
                                            {statusLabels[request.status]}
                                        </span>
                                    </div>
                                </div>

                                <p className="walletAdminDate">Solicitata la {formatDate(request.requestedAt)}</p>

                                <label className="walletAdminComment">
                                    Comentariu administrator
                                    <textarea
                                        rows={3}
                                        value={comments[request.id] ?? ""}
                                        onChange={(event) =>
                                            setComments((prev) => ({ ...prev, [request.id]: event.target.value }))
                                        }
                                        disabled={!isPending || isSaving}
                                        placeholder="Motiv sau observatii despre retragere..."
                                    />
                                </label>

                                {isPending ? (
                                    <div className="walletAdminActions">
                                        <button type="button" onClick={() => handleDecision(request.id, "approved")} disabled={isSaving}>
                                            {isSaving ? "Se salveaza..." : "Aproba"}
                                        </button>
                                        <button
                                            type="button"
                                            className="walletReject"
                                            onClick={() => handleDecision(request.id, "rejected")}
                                            disabled={isSaving}
                                        >
                                            Respinge
                                        </button>
                                    </div>
                                ) : (
                                    <p className="walletAdminProcessed">
                                        Procesata la {formatDate(request.processedAt)}
                                        {request.processedByAdminName ? ` de ${request.processedByAdminName}` : ""}
                                    </p>
                                )}
                            </article>
                        );
                    })}
                </section>
            )}
        </div>
    );
}
