import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "../styles/Messages.css";
import { useAuth } from "../context/AuthContext";
import {
    getConversations,
    getMessages,
    sendMessage,
    type ChatConversation,
    type ChatMessage,
} from "../services/chatService";

function formatDate(value: string) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return date.toLocaleString("ro-RO", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function Messages() {
    const { currentUser } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const [conversations, setConversations] = useState<ChatConversation[]>([]);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [draft, setDraft] = useState("");
    const [isLoadingConversations, setIsLoadingConversations] = useState(true);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const selectedConversation = useMemo(
        () => conversations.find((conversation) => conversation.id === selectedId) ?? null,
        [conversations, selectedId]
    );

    async function loadConversations(preferredId?: number | null) {
        try {
            setIsLoadingConversations(true);
            const data = await getConversations();
            setConversations(data);
            setError(null);

            const queryId = Number(searchParams.get("conversation"));
            const nextId = preferredId || (Number.isFinite(queryId) && queryId > 0 ? queryId : null) || data[0]?.id || null;
            setSelectedId(nextId);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Nu s-au putut incarca conversatiile.");
        } finally {
            setIsLoadingConversations(false);
        }
    }

    async function loadMessages(conversationId: number) {
        try {
            setIsLoadingMessages(true);
            const data = await getMessages(conversationId);
            setMessages(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Nu s-au putut incarca mesajele.");
            setMessages([]);
        } finally {
            setIsLoadingMessages(false);
        }
    }

    useEffect(() => {
        if (!currentUser) {
            setIsLoadingConversations(false);
            return;
        }

        void loadConversations();
    }, [currentUser?.id]);

    useEffect(() => {
        if (!selectedId) {
            setMessages([]);
            return;
        }

        setSearchParams({ conversation: String(selectedId) }, { replace: true });
        void loadMessages(selectedId);
    }, [selectedId]);

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        const body = draft.trim();

        if (!selectedId || !body) {
            return;
        }

        try {
            setIsSending(true);
            const created = await sendMessage(selectedId, body);
            setMessages((prev) => [...prev, created]);
            setDraft("");
            await loadConversations(selectedId);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Nu s-a putut trimite mesajul.");
        } finally {
            setIsSending(false);
        }
    }

    if (!currentUser) {
        return (
            <div className="messages-page">
                <section className="messages-shell messages-empty-auth">
                    <h1>Mesaje</h1>
                    <p>Autentifica-te ca sa poti scrie sitterilor.</p>
                </section>
            </div>
        );
    }

    return (
        <div className="messages-page">
            <section className="messages-hero">
                <h1>Mesaje</h1>
                <p>Discuta rapid cu sitterii despre disponibilitate, program si detalii.</p>
            </section>

            <section className="messages-shell">
                <aside className="conversation-list" aria-label="Conversatii">
                    <div className="conversation-list-header">
                        <h2>Conversatii</h2>
                    </div>

                    {isLoadingConversations ? (
                        <div className="messages-empty">Se incarca...</div>
                    ) : conversations.length === 0 ? (
                        <div className="messages-empty">Nu ai conversatii inca.</div>
                    ) : (
                        conversations.map((conversation) => (
                            <button
                                type="button"
                                key={conversation.id}
                                className={`conversation-item${conversation.id === selectedId ? " is-active" : ""}`}
                                onClick={() => setSelectedId(conversation.id)}
                            >
                                <span className="conversation-name">{conversation.sitterName || conversation.sitterUserName}</span>
                                <span className="conversation-preview">{conversation.lastMessage || "Conversatie noua"}</span>
                                <span className="conversation-time">{formatDate(conversation.lastMessageAt)}</span>
                            </button>
                        ))
                    )}
                </aside>

                <div className="chat-panel">
                    <div className="chat-header">
                        <div>
                            <h2>{selectedConversation?.sitterName ?? "Alege o conversatie"}</h2>
                            {selectedConversation ? (
                                <p>{selectedConversation.sitterUserName || "Sitter"}</p>
                            ) : null}
                        </div>
                    </div>

                    {error ? <div className="messages-error">{error}</div> : null}

                    <div className="message-list">
                        {isLoadingMessages ? (
                            <div className="messages-empty">Se incarca mesajele...</div>
                        ) : !selectedId ? (
                            <div className="messages-empty">Selecteaza o conversatie.</div>
                        ) : messages.length === 0 ? (
                            <div className="messages-empty">Trimite primul mesaj.</div>
                        ) : (
                            messages.map((message) => (
                                <article
                                    key={message.id}
                                    className={`message-bubble${message.isMine ? " is-mine" : ""}`}
                                >
                                    <div className="message-meta">
                                        <strong>{message.isMine ? "Tu" : message.senderName || "Sitter"}</strong>
                                        <span>{formatDate(message.createdAt)}</span>
                                    </div>
                                    <p>{message.body}</p>
                                </article>
                            ))
                        )}
                    </div>

                    <form className="message-form" onSubmit={handleSubmit}>
                        <input
                            value={draft}
                            onChange={(event) => setDraft(event.target.value)}
                            placeholder="Scrie un mesaj..."
                            maxLength={2000}
                            disabled={!selectedId || isSending}
                        />
                        <button type="submit" disabled={!selectedId || !draft.trim() || isSending}>
                            {isSending ? "Se trimite..." : "Trimite"}
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
}