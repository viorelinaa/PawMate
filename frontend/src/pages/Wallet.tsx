import { useEffect, useState, type FormEvent } from "react";
import {
    createWithdrawalRequest,
    getMyWallet,
    updatePayPalSandboxAccount,
    type WalletSummary,
    type WalletTransactionType,
    type WithdrawalStatus,
} from "../services/walletService";
import "../styles/Wallet.css";

const transactionLabels: Record<WalletTransactionType, string> = {
    sale_credit: "Vanzare",
    withdrawal_request: "Retragere solicitata",
    withdrawal_refund: "Suma restituita",
};

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

type WalletProps = {
    embedded?: boolean;
};

export default function Wallet({ embedded = false }: WalletProps) {
    const [wallet, setWallet] = useState<WalletSummary | null>(null);
    const [amount, setAmount] = useState("");
    const [payPalEmail, setPayPalEmail] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [savingPayPalEmail, setSavingPayPalEmail] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    async function loadWallet() {
        try {
            setLoading(true);
            const walletData = await getMyWallet();
            setWallet(walletData);
            setPayPalEmail(walletData.payPalSandboxEmail ?? "");
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Nu s-a putut incarca portofelul.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        void loadWallet();
    }, []);

    async function handlePayPalAccountSave(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        try {
            setSavingPayPalEmail(true);
            const account = await updatePayPalSandboxAccount(payPalEmail);
            setPayPalEmail(account.email);
            setWallet((current) => current ? { ...current, payPalSandboxEmail: account.email } : current);
            setSuccess("Contul PayPal Sandbox a fost salvat.");
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Nu s-a putut salva contul PayPal Sandbox.");
            setSuccess(null);
        } finally {
            setSavingPayPalEmail(false);
        }
    }

    async function handleWithdrawal(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const parsedAmount = Number(amount);

        if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
            setError("Introdu o suma valida pentru retragere.");
            setSuccess(null);
            return;
        }

        try {
            setSubmitting(true);
            await createWithdrawalRequest(parsedAmount);
            setAmount("");
            setSuccess("Cererea de retragere sandbox a fost trimisa administratorului.");
            setError(null);
            await loadWallet();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Nu s-a putut trimite cererea.");
            setSuccess(null);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className={`walletPage ${embedded ? "walletPageEmbedded" : ""}`}>
            <header className="walletHeader">
                <div>
                    <p className="walletKicker">Marketplace Sandbox</p>
                    <h1>Portofelul meu</h1>
                    <p>Incasarile apar aici dupa confirmarea platilor PayPal Sandbox.</p>
                </div>
                <button type="button" className="walletRefresh" onClick={loadWallet} disabled={loading}>
                    {loading ? "Se incarca..." : "Reincarca"}
                </button>
            </header>

            {error ? <div className="walletFeedback walletFeedbackError">{error}</div> : null}
            {success ? <div className="walletFeedback walletFeedbackSuccess">{success}</div> : null}

            {loading && !wallet ? (
                <div className="walletState">Se incarca portofelul...</div>
            ) : wallet ? (
                <>
                    <section className="walletPayPalPanel">
                        <div>
                            <p className="walletPanelLabel">Destinatia retragerilor</p>
                            <h2>Cont PayPal Sandbox</h2>
                            <p>Cererile de retragere vor fi asociate cu acest email. Nu sunt transferati bani reali.</p>
                        </div>
                        <form className="walletPayPalForm" onSubmit={handlePayPalAccountSave}>
                            <label>
                                Email PayPal Sandbox
                                <input
                                    type="email"
                                    required
                                    value={payPalEmail}
                                    onChange={(event) => setPayPalEmail(event.target.value)}
                                    placeholder="seller-facilitator@example.com"
                                />
                            </label>
                            <button type="submit" disabled={savingPayPalEmail}>
                                {savingPayPalEmail ? "Se salveaza..." : "Salveaza contul"}
                            </button>
                        </form>
                    </section>

                    <section className="walletStats" aria-label="Sold portofel">
                        <article className="walletStat walletStatPrimary">
                            <span>Disponibil</span>
                            <strong>{formatMoney(wallet.availableBalance)}</strong>
                            <small>Poate fi retras in sandbox</small>
                        </article>
                        <article className="walletStat">
                            <span>Retrageri in asteptare</span>
                            <strong>{formatMoney(wallet.pendingWithdrawalBalance)}</strong>
                            <small>Suma rezervata</small>
                        </article>
                        <article className="walletStat">
                            <span>Total incasat</span>
                            <strong>{formatMoney(wallet.totalEarned)}</strong>
                            <small>Din vanzari confirmate</small>
                        </article>
                        <article className="walletStat">
                            <span>Total retras</span>
                            <strong>{formatMoney(wallet.totalWithdrawn)}</strong>
                            <small>Retrageri sandbox aprobate</small>
                        </article>
                    </section>

                    <section className="walletPanel">
                        <div>
                            <p className="walletPanelLabel">Retragere simulata</p>
                            <h2>Solicita retragerea soldului</h2>
                            <p>Suma este rezervata pana cand administratorul aproba sau respinge cererea.</p>
                        </div>
                        <form className="walletWithdrawalForm" onSubmit={handleWithdrawal}>
                            <label>
                                Suma in MDL
                                <input
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    max={wallet.availableBalance || undefined}
                                    value={amount}
                                    onChange={(event) => setAmount(event.target.value)}
                                    placeholder="0.00"
                                />
                            </label>
                            <button
                                type="submit"
                                disabled={submitting || wallet.availableBalance <= 0 || !wallet.payPalSandboxEmail}
                                title={!wallet.payPalSandboxEmail ? "Configureaza contul PayPal Sandbox mai intai." : undefined}
                            >
                                {submitting ? "Se trimite..." : "Solicita retragerea"}
                            </button>
                        </form>
                    </section>

                    <section className="walletGrid">
                        <article className="walletListPanel">
                            <h2>Istoric tranzactii</h2>
                            {wallet.transactions.length === 0 ? (
                                <p className="walletEmpty">Nu exista tranzactii inca.</p>
                            ) : (
                                <div className="walletList">
                                    {wallet.transactions.map((transaction) => (
                                        <div key={transaction.id} className="walletListItem">
                                            <div>
                                                <strong>{transactionLabels[transaction.type] ?? transaction.type}</strong>
                                                <span>{transaction.description}</span>
                                                <small>{formatDate(transaction.createdAt)}</small>
                                            </div>
                                            <b className={transaction.amount >= 0 ? "walletAmountPositive" : "walletAmountNegative"}>
                                                {transaction.amount >= 0 ? "+" : ""}
                                                {formatMoney(transaction.amount)}
                                            </b>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </article>

                        <article className="walletListPanel">
                            <h2>Cereri de retragere</h2>
                            {wallet.withdrawals.length === 0 ? (
                                <p className="walletEmpty">Nu ai solicitat retrageri inca.</p>
                            ) : (
                                <div className="walletList">
                                    {wallet.withdrawals.map((withdrawal) => (
                                        <div key={withdrawal.id} className="walletWithdrawalItem">
                                            <div className="walletWithdrawalTop">
                                                <strong>{formatMoney(withdrawal.amount)}</strong>
                                                <span className={`walletStatus walletStatus--${withdrawal.status}`}>
                                                    {statusLabels[withdrawal.status]}
                                                </span>
                                            </div>
                                            <small>Solicitata la {formatDate(withdrawal.requestedAt)}</small>
                                            <small>Catre {withdrawal.destinationPayPalEmail}</small>
                                            {withdrawal.adminComment ? <p>{withdrawal.adminComment}</p> : null}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </article>
                    </section>
                </>
            ) : null}
        </div>
    );
}
